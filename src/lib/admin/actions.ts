"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyStatusChange } from "@/lib/email/notifications";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/applications";

export type AdminActionState = { ok?: boolean; error?: string };

// Cambiar el estado de una solicitud (el trigger registra el historial).
export async function updateStatus(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!APPLICATION_STATUSES.includes(status as ApplicationStatus))
    return { error: "Estado inválido." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: status as ApplicationStatus })
    .eq("id", applicationId);

  if (error) return { error: "No se pudo actualizar el estado." };

  // Correo al usuario en cambios relevantes (best-effort).
  if (status === "en_revision" || status === "preaprobada") {
    const { data: app } = await supabase
      .from("applications")
      .select("folio, user_id")
      .eq("id", applicationId)
      .maybeSingle();
    if (app) {
      const { data: userRes } = await supabase.auth.admin.getUserById(
        app.user_id,
      );
      const email = userRes?.user?.email;
      if (email) {
        await notifyStatusChange(email, app.folio, status as ApplicationStatus);
      }
    }
  }

  void admin;
  revalidatePath(`/admin/${applicationId}`);
  revalidatePath("/admin");
  return { ok: true };
}

// Agregar una nota interna (no visible para el usuario).
export async function addNote(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!nota) return { error: "La nota está vacía." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("application_notes")
    .insert({ application_id: applicationId, nota, created_by: admin.id });

  if (error) return { error: "No se pudo guardar la nota." };

  revalidatePath(`/admin/${applicationId}`);
  return { ok: true };
}
