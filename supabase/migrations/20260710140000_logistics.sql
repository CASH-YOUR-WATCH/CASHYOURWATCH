-- ============================================================================
-- Cash Your Watch — Fase 3: Contraoferta + Logística de envío
--
-- Tras la validación a distancia, el equipo envía una CONTRAOFERTA (monto a
-- prestar). Si el usuario la acepta, CYW gestiona una GUÍA de paquetería
-- (asegurada por el valor del reloj) y se registra en tiempo real el avance del
-- envío: guía generada → en tránsito → recibido → inspección → aprobado
-- (o rechazado / devuelto). Cada movimiento queda en `logistics_events`.
--
-- La plataforma NO procesa pagos: los avisos de costos (financiados por CYW,
-- descontados del préstamo; guía de regreso si no procede) son informativos.
-- ============================================================================

alter table public.applications
  add column if not exists monto_contraoferta         numeric(12, 2),
  add column if not exists contraoferta_status        text not null default 'ninguna'
    check (contraoferta_status in ('ninguna', 'pendiente', 'aceptada', 'rechazada')),
  add column if not exists contraoferta_at            timestamptz,
  add column if not exists contraoferta_respondida_at timestamptz,
  add column if not exists guia_paqueteria            text,
  add column if not exists guia_tracking              text,
  add column if not exists guia_storage_path          text,
  add column if not exists monto_asegurado            numeric(12, 2);

-- El usuario no debe poder auto-asignarse contraoferta/guía al crear la
-- solicitud. Extendemos el trigger BEFORE INSERT (que ya forzaba due_diligence)
-- para resetear todos los campos que solo controla el equipo.
create or replace function public.force_due_diligence_pendiente()
returns trigger
language plpgsql
as $$
begin
  new.due_diligence               := 'pendiente';
  new.contraoferta_status         := 'ninguna';
  new.monto_contraoferta          := null;
  new.contraoferta_at             := null;
  new.contraoferta_respondida_at  := null;
  new.guia_paqueteria             := null;
  new.guia_tracking               := null;
  new.guia_storage_path           := null;
  new.monto_asegurado             := null;
  return new;
end;
$$;

-- Registro de movimientos del envío (timeline en tiempo real).
create table if not exists public.logistics_events (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  etapa          text not null check (etapa in (
                   'guia_generada', 'en_transito', 'recibido',
                   'inspeccion', 'aprobado', 'rechazado', 'devuelto'
                 )),
  nota           text,
  created_by     uuid references public.profiles (id),
  created_at     timestamptz not null default now()
);

comment on table public.logistics_events is 'Bitácora del envío del reloj. El estado actual del envío es la etapa del evento más reciente.';

create index if not exists logistics_events_application_id_idx
  on public.logistics_events (application_id);

alter table public.logistics_events enable row level security;

drop policy if exists "logistics: leer propias o admin" on public.logistics_events;
create policy "logistics: leer propias o admin"
  on public.logistics_events for select to authenticated
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_id and a.user_id = (select auth.uid())
    )
    or (select private.is_admin())
  );

notify pgrst, 'reload schema';
