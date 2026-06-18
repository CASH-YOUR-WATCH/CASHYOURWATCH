import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Cliente con la llave `service_role`. SOLO para el servidor.
 *
 * Omite las políticas RLS, así que tiene acceso TOTAL a la base de datos.
 * Úsalo únicamente para tareas controladas del servidor (heartbeat, firmar
 * URLs de archivos privados tras verificar permisos, etc.).
 *
 * El `import "server-only"` provoca un error de build si alguien intenta
 * importarlo en código del navegador.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
