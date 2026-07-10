-- ============================================================================
-- Cash Your Watch — Fase 4: Protocolo antifraude de empaque
--
-- Antes de enviar el reloj, el propietario documenta su empaque con fotos
-- (reloj, contenido y paquete sellado). Esas fotos SÍ viven en la plataforma
-- para cotejar la caja/paquete cuando el equipo lo reciba y lo abra en video
-- (el video NO se sube; es evidencia externa en caso de fraude).
--
-- Solo ampliamos los tipos permitidos en application_files.
-- ============================================================================

alter table public.application_files drop constraint if exists application_files_tipo_check;
alter table public.application_files add constraint application_files_tipo_check
  check (tipo in (
    'foto_frontal', 'foto_trasera', 'foto_lateral', 'foto_cierre', 'foto_serie',
    'doc_factura', 'doc_certificado', 'doc_garantia', 'doc_propiedad',
    'evidencia_caja', 'evidencia_papeles', 'evidencia_ajustadores', 'evidencia_full_set',
    'empaque_reloj', 'empaque_contenido', 'empaque_sellado'
  ));

notify pgrst, 'reload schema';
