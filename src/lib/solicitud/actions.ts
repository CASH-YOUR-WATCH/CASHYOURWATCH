"use server";

import { createClient } from "@/lib/supabase/server";
import {
  notifyApplicationReceived,
  notifyAdminNewApplication,
} from "@/lib/email/notifications";

/**
 * Dispara los correos tras enviarse una solicitud (al usuario + al admin).
 * Se llama desde el wizard (cliente) después de crear la solicitud.
 * Best-effort: cualquier fallo de correo no rompe el flujo.
 */
export async function notifyApplicationSubmitted(applicationId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: app } = await supabase
      .from("applications")
      .select("folio, marca, modelo")
      .eq("id", applicationId)
      .maybeSingle();
    if (!app) return;

    const reloj = `${app.marca} ${app.modelo}`.trim();

    if (user.email) {
      await notifyApplicationReceived(user.email, app.folio, reloj);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("nombre")
      .eq("id", user.id)
      .maybeSingle();

    await notifyAdminNewApplication(
      app.folio,
      reloj,
      profile?.nombre ?? user.email ?? "Solicitante",
    );
  } catch (err) {
    console.error("[notifyApplicationSubmitted]", err);
  }
}
