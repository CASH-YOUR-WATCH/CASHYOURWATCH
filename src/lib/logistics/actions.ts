"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type CounterofferState = { ok?: boolean; error?: string };

/**
 * El usuario acepta o rechaza la contraoferta. Verifica que sea el dueño y que
 * la contraoferta esté pendiente; escribe con service_role para que no pueda
 * tocar el monto ni otros campos.
 */
export async function respondCounteroffer(
  applicationId: string,
  accept: boolean,
): Promise<CounterofferState> {
  if (!applicationId) return { error: "Datos incompletos." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesión no válida." };

  const { data: app } = await supabase
    .from("applications")
    .select("id, user_id, contraoferta_status")
    .eq("id", applicationId)
    .maybeSingle();

  if (!app || app.user_id !== user.id)
    return { error: "Solicitud no encontrada." };
  if (app.contraoferta_status !== "pendiente")
    return { error: "Esta contraoferta ya no está disponible." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("applications")
    .update({
      contraoferta_status: accept ? "aceptada" : "rechazada",
      contraoferta_respondida_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) return { error: "No se pudo registrar tu respuesta." };

  revalidatePath(`/panel/${applicationId}`);
  revalidatePath(`/admin/${applicationId}`);
  return { ok: true };
}
