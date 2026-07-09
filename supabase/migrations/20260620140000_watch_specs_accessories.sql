-- ============================================================================
-- Cash Your Watch — Fase 1 de la ampliación del onboarding
--
-- Añade a `applications`:
--   · diametro_mm      — diámetro de la caja del reloj (mm), relevante para valuar
--   · atributos_extra  — texto libre (material, complicaciones, edición, etc.)
--   · tiene_caja / tiene_papeles / tiene_ajustadores / full_set — accesorios (sí/no)
--
-- Amplía el CHECK de `application_files.tipo` con la evidencia de accesorios:
--   evidencia_caja, evidencia_papeles, evidencia_ajustadores, evidencia_full_set
-- ============================================================================

alter table public.applications
  add column if not exists diametro_mm      smallint
    check (diametro_mm is null or diametro_mm between 10 and 80),
  add column if not exists atributos_extra  text,
  add column if not exists tiene_caja       boolean not null default false,
  add column if not exists tiene_papeles    boolean not null default false,
  add column if not exists tiene_ajustadores boolean not null default false,
  add column if not exists full_set         boolean not null default false;

comment on column public.applications.diametro_mm is 'Diámetro de la caja en milímetros.';
comment on column public.applications.atributos_extra is 'Atributos adicionales que el dueño desee resaltar (material, complicaciones, edición especial…).';
comment on column public.applications.tiene_caja is 'Declara tener la caja original.';
comment on column public.applications.tiene_papeles is 'Declara tener papeles/certificado.';
comment on column public.applications.tiene_ajustadores is 'Declara tener el set de ajustadores/eslabones.';
comment on column public.applications.full_set is 'Declara que es un full set (todo completo).';

-- Ampliar los tipos de archivo permitidos con la evidencia de accesorios.
alter table public.application_files drop constraint if exists application_files_tipo_check;
alter table public.application_files add constraint application_files_tipo_check
  check (tipo in (
    'foto_frontal', 'foto_trasera', 'foto_lateral', 'foto_cierre', 'foto_serie',
    'doc_factura', 'doc_certificado', 'doc_garantia', 'doc_propiedad',
    'evidencia_caja', 'evidencia_papeles', 'evidencia_ajustadores', 'evidencia_full_set'
  ));
