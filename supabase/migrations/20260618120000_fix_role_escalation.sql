-- ============================================================================
-- Fix: prevent_role_escalation bloqueaba TODO cambio de rol cuando auth.uid()
-- era null (servidor / SQL editor), impidiendo promover al primer admin.
-- Ahora solo bloquea a un usuario autenticado que no sea admin.
-- ============================================================================
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not (select private.is_admin()) then
    raise exception 'No autorizado para cambiar el rol del perfil';
  end if;
  return new;
end;
$$;
