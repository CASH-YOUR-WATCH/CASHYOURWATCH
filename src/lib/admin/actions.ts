"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyStatusChange } from "@/lib/email/notifications";
import {
  APPLICATION_STATUSES,
  DUE_DILIGENCE_VALUES,
  type ApplicationStatus,
  type DueDiligence,
} from "@/lib/applications";
import { LOGISTICS_STAGES, type LogisticsStage } from "@/lib/logistics";

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

// Registrar el resultado de la debida diligencia (verificación de procedencia).
export async function updateDueDiligence(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const due = String(formData.get("dueDiligence") ?? "");

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!DUE_DILIGENCE_VALUES.includes(due as DueDiligence))
    return { error: "Valor inválido." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("applications")
    .update({ due_diligence: due as DueDiligence })
    .eq("id", applicationId);

  if (error) return { error: "No se pudo guardar la verificación." };

  void admin;
  revalidatePath(`/admin/${applicationId}`);
  revalidatePath("/admin");
  return { ok: true };
}

// Solicitar una prueba de existencia (el usuario deberá subir una foto del
// reloj dentro de la ventana horaria indicada).
export async function requestExistenceProof(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const start = String(formData.get("windowStart") ?? "");
  const end = String(formData.get("windowEnd") ?? "");
  const instrucciones = String(formData.get("instrucciones") ?? "").trim();

  if (!applicationId) return { error: "Falta la solicitud." };
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    return { error: "Indica la ventana horaria." };
  if (endDate.getTime() <= startDate.getTime())
    return { error: "La hora de fin debe ser posterior a la de inicio." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("existence_proofs").insert({
    application_id: applicationId,
    window_start: startDate.toISOString(),
    window_end: endDate.toISOString(),
    instrucciones: instrucciones || null,
    created_by: admin.id,
  });

  if (error) return { error: "No se pudo crear la solicitud." };

  revalidatePath(`/admin/${applicationId}`);
  return { ok: true };
}

// Enviar una contraoferta (monto a prestar). Queda 'pendiente' de respuesta.
export async function sendCounteroffer(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const montoRaw = String(formData.get("monto") ?? "").trim();
  const monto = Number(montoRaw);

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!montoRaw || isNaN(monto) || monto <= 0)
    return { error: "Indica un monto válido." };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("applications")
    .update({
      monto_contraoferta: monto,
      contraoferta_status: "pendiente",
      contraoferta_at: new Date().toISOString(),
      contraoferta_respondida_at: null,
    })
    .eq("id", applicationId);

  if (error) return { error: "No se pudo enviar la contraoferta." };

  revalidatePath(`/admin/${applicationId}`);
  revalidatePath(`/panel/${applicationId}`);
  return { ok: true };
}

// Registrar la guía de envío (paquetería + rastreo + monto asegurado + PDF
// opcional) y abrir la bitácora del envío con la etapa 'guia_generada'.
export async function registerGuia(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const paqueteria = String(formData.get("paqueteria") ?? "").trim();
  const tracking = String(formData.get("tracking") ?? "").trim();
  const aseguradoRaw = String(formData.get("asegurado") ?? "").trim();
  const asegurado = aseguradoRaw ? Number(aseguradoRaw) : null;
  const file = formData.get("guia") as File | null;

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!paqueteria || !tracking)
    return { error: "Indica la paquetería y el número de rastreo." };

  const supabase = createAdminClient();

  const { data: app } = await supabase
    .from("applications")
    .select("user_id")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return { error: "Solicitud no encontrada." };

  let storagePath: string | undefined;
  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    storagePath = `${app.user_id}/${applicationId}/guia.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from("application-files")
      .upload(storagePath, buffer, {
        upsert: true,
        contentType: file.type || "application/pdf",
      });
    if (upErr) return { error: "No se pudo subir la guía." };
  }

  const { error } = await supabase
    .from("applications")
    .update({
      guia_paqueteria: paqueteria,
      guia_tracking: tracking,
      monto_asegurado: asegurado,
      ...(storagePath ? { guia_storage_path: storagePath } : {}),
    })
    .eq("id", applicationId);
  if (error) return { error: "No se pudo registrar la guía." };

  await supabase.from("logistics_events").insert({
    application_id: applicationId,
    etapa: "guia_generada",
    created_by: admin.id,
  });

  revalidatePath(`/admin/${applicationId}`);
  revalidatePath(`/panel/${applicationId}`);
  return { ok: true };
}

// Registrar un movimiento del envío (avanza el timeline en tiempo real).
export async function addLogisticsEvent(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const applicationId = String(formData.get("applicationId") ?? "");
  const etapa = String(formData.get("etapa") ?? "");
  const nota = String(formData.get("nota") ?? "").trim();

  if (!applicationId) return { error: "Falta la solicitud." };
  if (!LOGISTICS_STAGES.includes(etapa as LogisticsStage))
    return { error: "Etapa inválida." };

  const supabase = createAdminClient();
  const { error } = await supabase.from("logistics_events").insert({
    application_id: applicationId,
    etapa,
    nota: nota || null,
    created_by: admin.id,
  });

  if (error) return { error: "No se pudo registrar el movimiento." };

  revalidatePath(`/admin/${applicationId}`);
  revalidatePath(`/panel/${applicationId}`);
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
