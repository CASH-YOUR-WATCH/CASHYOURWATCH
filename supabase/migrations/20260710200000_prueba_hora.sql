-- ============================================================================
-- Cash Your Watch — Hora aleatoria para la prueba de existencia
--
-- Se le pide al solicitante ajustar las manecillas del reloj a una hora
-- aleatoria exacta (que la plataforma le indica) y fotografiarlo. Guardamos esa
-- hora para que el equipo pueda cotejar la foto y confirmar la posesión real.
-- ============================================================================

alter table public.applications
  add column if not exists prueba_hora text;

comment on column public.applications.prueba_hora is 'Hora aleatoria (H:MM) que se pidió marcar en el reloj para la prueba de existencia.';

notify pgrst, 'reload schema';
