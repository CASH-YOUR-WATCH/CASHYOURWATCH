"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ExistenceSubmitState = { ok?: boolean; error?: string };

/**
 * Registra la foto de prueba de existencia que el usuario ya subió al bucket.
 * Verifica que la sesión sea del dueño de la solicitud antes de escribir; la
 * escritura se hace con service_role para que el usuario no pueda tocar otros
 * campos de la fila (ventana, etc.).
 */
export async function submitExistenceProof(
  proofId: string,
  storagePath: string,
): Promise<ExistenceSubmitState> {
  if (!proofId || !storagePath) return { error: "Datos incompletos." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión no válida." };

  // Leer la prueba con el cliente del usuario (RLS solo deja ver las propias).
  const { data: proof } = await supabase
    .from("existence_proofs")
    .select("id, application_id, storage_path")
    .eq("id", proofId)
    .maybeSingle();

  if (!proof) return { error: "Solicitud no encontrada." };
  if (proof.storage_path) return { error: "Esta prueba ya fue enviada." };

  // Confirmar que la ruta subida está dentro de la carpeta del propio usuario.
  if (!storagePath.startsWith(`${user.id}/`))
    return { error: "Ruta de archivo no válida." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("existence_proofs")
    .update({
      storage_path: storagePath,
      responded_at: new Date().toISOString(),
    })
    .eq("id", proofId);

  if (error) return { error: "No se pudo registrar la foto." };

  revalidatePath(`/panel/${proof.application_id}`);
  revalidatePath(`/admin/${proof.application_id}`);
  return { ok: true };
}
