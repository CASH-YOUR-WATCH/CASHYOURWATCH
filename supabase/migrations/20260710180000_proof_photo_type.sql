-- ============================================================================
-- Cash Your Watch — Prueba de existencia OBLIGATORIA en la solicitud
--
-- La prueba de existencia deja de pedirse "después" y pasa a ser una foto
-- obligatoria dentro del formulario de solicitud. Se guarda como un tipo de
-- archivo más en application_files: 'prueba_existencia'.
-- ============================================================================

alter table public.application_files drop constraint if exists application_files_tipo_check;
alter table public.application_files add constraint application_files_tipo_check
  check (tipo in (
    'foto_frontal', 'foto_trasera', 'foto_lateral', 'foto_cierre', 'foto_serie',
    'doc_factura', 'doc_certificado', 'doc_garantia', 'doc_propiedad',
    'evidencia_caja', 'evidencia_papeles', 'evidencia_ajustadores', 'evidencia_full_set',
    'empaque_reloj', 'empaque_contenido', 'empaque_sellado',
    'prueba_existencia'
  ));

notify pgrst, 'reload schema';
