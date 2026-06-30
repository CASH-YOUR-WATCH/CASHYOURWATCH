-- ============================================================================
-- Cash Your Watch — Detalles del reloj + declaración de licitud + due diligence
--
-- Añade a `applications`:
--   · numero_referencia    — referencia del reloj (Chrono24-style)
--   · anio_fabricacion     — año de fabricación (aprox.)
--   · declaracion_licitud  — el solicitante declaró procedencia lícita (manifiesto)
--   · due_diligence        — resultado de la verificación interna (solo admin)
--
-- `due_diligence` es de uso exclusivo del equipo. Aunque la política de INSERT
-- permite al usuario crear sus solicitudes, un trigger fuerza el valor a
-- 'pendiente' en la inserción para que nadie pueda auto-marcarse 'verificado'.
-- ============================================================================

alter table public.applications
  add column if not exists numero_referencia   text,
  add column if not exists anio_fabricacion    smallint
    check (anio_fabricacion is null or anio_fabricacion between 1900 and 2100),
  add column if not exists declaracion_licitud boolean not null default false,
  add column if not exists due_diligence       text not null default 'pendiente'
    check (due_diligence in ('pendiente', 'verificado', 'alerta'));

comment on column public.applications.numero_referencia is 'Número de referencia del reloj (identificador del modelo).';
comment on column public.applications.anio_fabricacion is 'Año de fabricación aproximado.';
comment on column public.applications.declaracion_licitud is 'El solicitante aceptó la declaración de procedencia lícita (manifiesto anti-robo).';
comment on column public.applications.due_diligence is 'Resultado de la debida diligencia interna: pendiente | verificado | alerta. Solo el admin lo modifica.';

-- El due_diligence siempre nace 'pendiente', sin importar lo que envíe el cliente.
create or replace function public.force_due_diligence_pendiente()
returns trigger
language plpgsql
as $$
begin
  new.due_diligence := 'pendiente';
  return new;
end;
$$;

drop trigger if exists applications_force_dd on public.applications;
create trigger applications_force_dd
  before insert on public.applications
  for each row execute function public.force_due_diligence_pendiente();
