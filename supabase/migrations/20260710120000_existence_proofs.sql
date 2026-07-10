-- ============================================================================
-- Cash Your Watch — Fase 2: Prueba de existencia
--
-- El equipo solicita, en un horario específico, que el solicitante suba una
-- foto del reloj para corroborar que lo tiene físicamente. Puede pedirse varias
-- veces por solicitud (de forma aleatoria), por eso es una tabla 1-a-muchos.
--
-- El estado (pendiente / abierta / vencida / enviada) se DERIVA en la app a
-- partir de las fechas y de si ya hay foto; no se guarda para evitar desajustes.
-- ============================================================================
create table public.existence_proofs (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  window_start   timestamptz not null,          -- inicio de la ventana para responder
  window_end     timestamptz not null,          -- fin de la ventana
  instrucciones  text,                           -- p. ej. "foto con la fecha del día escrita a un lado"
  storage_path   text,                           -- foto subida (null hasta que responde)
  responded_at   timestamptz,                    -- cuándo subió la foto
  created_by     uuid references public.profiles (id),  -- admin que la solicitó
  created_at     timestamptz not null default now()
);

comment on table public.existence_proofs is 'Solicitudes de prueba de existencia: el usuario sube una foto del reloj dentro de una ventana horaria. La foto vive en el bucket privado.';

create index existence_proofs_application_id_idx on public.existence_proofs (application_id);

-- RLS: el usuario LEE las de sus solicitudes; el admin lee todas. Las inserciones
-- (admin) y la respuesta del usuario pasan por el servidor con service_role, así
-- que no exponemos INSERT/UPDATE directos a los clientes.
alter table public.existence_proofs enable row level security;

create policy "existence: leer propias o admin"
  on public.existence_proofs for select to authenticated
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = (select auth.uid())
    )
    or (select private.is_admin())
  );

-- Refresca el caché del esquema de PostgREST (cubre también columnas de la Fase 1).
notify pgrst, 'reload schema';
