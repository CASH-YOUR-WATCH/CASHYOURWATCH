-- ============================================================================
-- Cash Your Watch — Esquema inicial (Fase 2)
-- Tablas, enum, triggers, RLS y bucket de Storage.
-- Todo en español. RLS activado en TODAS las tablas con datos de usuarios.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Esquema privado + helper de rol admin
--    Función SECURITY DEFINER: lee `profiles` saltándose RLS (evita recursión)
--    y siempre comprueba la identidad del usuario que llama.
-- ----------------------------------------------------------------------------
create schema if not exists private;

-- ----------------------------------------------------------------------------
-- 1. Tipos
-- ----------------------------------------------------------------------------
create type public.application_status as enum (
  'recibida',
  'en_revision',
  'preaprobada',
  'cita_agendada',
  'formalizada',
  'rechazada'
);

-- ----------------------------------------------------------------------------
-- 2. profiles  (1 a 1 con auth.users)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  nombre     text,
  telefono   text,
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil de cada usuario. role controla el acceso (user/admin).';

-- ----------------------------------------------------------------------------
-- 3. applications  (la solicitud)
-- ----------------------------------------------------------------------------
create sequence if not exists public.application_folio_seq start with 1 increment by 1;

create table public.applications (
  id             uuid primary key default gen_random_uuid(),
  folio          text not null unique,              -- legible, ej. CYW0428 (lo pone un trigger)
  user_id        uuid not null references public.profiles (id) on delete cascade,
  marca          text not null,
  modelo         text not null,
  estado_reloj   text not null check (estado_reloj in ('excelente', 'bueno', 'regular')),
  valor_estimado numeric(12, 2),                    -- lo estima CYW en la valuación
  monto_deseado  numeric(12, 2),                    -- lo pide el solicitante
  status         public.application_status not null default 'recibida',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.applications is 'Solicitud de financiamiento. El usuario la crea y no la edita tras enviar; el admin actualiza el status.';

create index applications_user_id_idx on public.applications (user_id);
create index applications_status_idx  on public.applications (status);

-- ----------------------------------------------------------------------------
-- 4. application_files  (fotos y documentos en bucket privado)
-- ----------------------------------------------------------------------------
create table public.application_files (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  tipo           text not null check (tipo in (
                   'foto_frontal', 'foto_trasera', 'foto_lateral', 'foto_cierre', 'foto_serie',
                   'doc_factura', 'doc_certificado', 'doc_garantia', 'doc_propiedad'
                 )),
  storage_path   text not null,                     -- ruta dentro del bucket privado
  created_at     timestamptz not null default now()
);

comment on table public.application_files is 'Metadatos de archivos. Los binarios viven en el bucket privado application-files; se sirven con signed URLs desde el servidor.';

create index application_files_application_id_idx on public.application_files (application_id);

-- ----------------------------------------------------------------------------
-- 5. application_status_history  (timeline del usuario)
-- ----------------------------------------------------------------------------
create table public.application_status_history (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  status         public.application_status not null,
  nota           text,
  created_at     timestamptz not null default now()
);

comment on table public.application_status_history is 'Historial de cambios de status para el timeline. Se llena automáticamente por trigger.';

create index application_status_history_application_id_idx on public.application_status_history (application_id);

-- ----------------------------------------------------------------------------
-- 6. application_notes  (notas internas — SOLO admin)
--    NOTA DE DISEÑO: el brief pedía un campo `notas_internas` dentro de
--    `applications`, pero como el usuario puede leer sus propias solicitudes
--    (RLS es por fila, no por columna) eso filtraría las notas. Por seguridad
--    las movemos a una tabla aparte con acceso exclusivo de admin. Bonus:
--    permite múltiples notas con autor y fecha.
-- ----------------------------------------------------------------------------
create table public.application_notes (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  nota           text not null,
  created_by     uuid references public.profiles (id),
  created_at     timestamptz not null default now()
);

comment on table public.application_notes is 'Notas internas del equipo CYW. Nunca visibles para el usuario.';

create index application_notes_application_id_idx on public.application_notes (application_id);

-- ----------------------------------------------------------------------------
-- 7. heartbeat  (keep-alive del proyecto free de Supabase)
-- ----------------------------------------------------------------------------
create table public.heartbeat (
  id        smallint primary key default 1 check (id = 1),  -- siempre una sola fila
  last_ping timestamptz not null default now()
);

insert into public.heartbeat (id, last_ping) values (1, now())
on conflict (id) do nothing;

comment on table public.heartbeat is 'Una sola fila. /api/heartbeat hace upsert de last_ping. Solo el service_role escribe.';

-- ============================================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================================

-- 8.1 Helper: ¿el usuario actual es admin? (SECURITY DEFINER, salta RLS)
create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke execute on function private.is_admin() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- 8.2 Crear perfil automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre, telefono)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nombre',
    new.raw_user_meta_data ->> 'telefono'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8.3 Impedir que un usuario se auto-promueva a admin
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Solo bloquea a un USUARIO autenticado que no sea admin. El servidor
  -- (service_role / SQL editor, donde auth.uid() es null) sí puede cambiar el
  -- rol — necesario para promover al primer admin.
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not (select private.is_admin()) then
    raise exception 'No autorizado para cambiar el rol del perfil';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- 8.4 Generar folio legible (CYW0001, CYW0002, ...) antes de insertar.
--     SECURITY DEFINER para que nextval() corra con privilegios del dueño y
--     no dependa de grants sobre la secuencia para el rol authenticated.
create or replace function public.set_application_folio()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.folio is null or new.folio = '' then
    new.folio := 'CYW' || lpad(nextval('public.application_folio_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger applications_set_folio
  before insert on public.applications
  for each row execute function public.set_application_folio();

-- 8.5 Mantener updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- 8.6 Registrar cada cambio de status en el historial (timeline)
create or replace function public.log_application_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.application_status_history (application_id, status)
    values (new.id, new.status);
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.application_status_history (application_id, status)
    values (new.id, new.status);
  end if;
  return new;
end;
$$;

create trigger applications_log_status
  after insert or update on public.applications
  for each row execute function public.log_application_status();

-- ============================================================================
-- ROW LEVEL SECURITY
-- service_role (cliente admin del servidor) tiene BYPASSRLS: ignora estas
-- políticas. Por eso heartbeat y notas internas se manejan desde el servidor.
-- ============================================================================

-- 9.1 profiles
alter table public.profiles enable row level security;

create policy "profiles: leer propio o admin"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profiles: actualizar propio o admin"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

-- 9.2 applications
alter table public.applications enable row level security;

create policy "applications: leer propias o admin"
  on public.applications for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy "applications: insertar propias"
  on public.applications for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "applications: actualizar solo admin"
  on public.applications for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- 9.3 application_files
alter table public.application_files enable row level security;

create policy "files: leer propias o admin"
  on public.application_files for select to authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = (select auth.uid())
    )
  );

create policy "files: insertar en solicitud propia"
  on public.application_files for insert to authenticated
  with check (
    exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = (select auth.uid())
    )
  );

-- 9.4 application_status_history
alter table public.application_status_history enable row level security;

create policy "historial: leer propio o admin"
  on public.application_status_history for select to authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = (select auth.uid())
    )
  );

create policy "historial: insertar solo admin"
  on public.application_status_history for insert to authenticated
  with check ((select private.is_admin()));

-- 9.5 application_notes  (solo admin, en cualquier operación)
alter table public.application_notes enable row level security;

create policy "notas: acceso total solo admin"
  on public.application_notes for all to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- 9.6 heartbeat  (sin políticas: nadie salvo service_role accede)
alter table public.heartbeat enable row level security;

-- ============================================================================
-- STORAGE  —  bucket privado para fotos y documentos
-- Convención de ruta: {auth.uid()}/{application_id}/{tipo}-{archivo}
-- El primer folder = id del dueño, lo que permite validar la subida con RLS.
-- La LECTURA real se hace con signed URLs generadas en el servidor.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('application-files', 'application-files', false)
on conflict (id) do nothing;

create policy "storage: subir a carpeta propia"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'application-files'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "storage: leer propios o admin"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'application-files'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select private.is_admin())
    )
  );
