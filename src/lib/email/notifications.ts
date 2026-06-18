import "server-only";
import { sendEmail } from "./send";
import { baseEmail } from "./templates";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications";

const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030"
).replace(/\/+$/, "");

/** Bienvenida al registrarse. */
export async function sendWelcome(to: string, nombre?: string) {
  await sendEmail({
    to,
    subject: "Bienvenido a Cash Your Watch",
    html: baseEmail({
      preheader: "Tu cuenta está lista.",
      heading: `Bienvenido${nombre ? `, ${nombre}` : ""}.`,
      body: `<p style="margin:0 0 14px">Tu cuenta en Cash Your Watch está lista. Ya puedes iniciar una solicitud de evaluación de forma profesional, segura y discreta.</p>`,
      ctaLabel: "Iniciar solicitud",
      ctaHref: `${SITE}/solicitud`,
    }),
  });
}

/** Confirmación al usuario de que su solicitud se recibió. */
export async function notifyApplicationReceived(
  to: string,
  folio: string,
  reloj: string,
) {
  await sendEmail({
    to,
    subject: `Recibimos tu solicitud · #${folio}`,
    html: baseEmail({
      preheader: `Solicitud ${folio} recibida.`,
      heading: "Recibimos tu solicitud.",
      body: `<p style="margin:0 0 14px">Tu solicitud <strong style="color:#f4f4f3">#${folio}</strong> (${reloj}) fue recibida. Nuestro equipo la revisará y te contactará pronto.</p>
             <p style="margin:0">Puedes dar seguimiento al estado desde tu cuenta.</p>`,
      ctaLabel: "Ver mi solicitud",
      ctaHref: `${SITE}/panel`,
    }),
  });
}

/** Aviso al equipo CYW de una solicitud nueva. */
export async function notifyAdminNewApplication(
  folio: string,
  reloj: string,
  solicitante: string,
) {
  const admin = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!admin) return;
  await sendEmail({
    to: admin,
    subject: `Nueva solicitud · #${folio}`,
    html: baseEmail({
      preheader: `Nueva solicitud de ${solicitante}.`,
      heading: "Nueva solicitud recibida.",
      body: `<p style="margin:0 0 14px">Se registró la solicitud <strong style="color:#f4f4f3">#${folio}</strong>.</p>
             <p style="margin:0 0 6px">Solicitante: ${solicitante}</p>
             <p style="margin:0">Activo: ${reloj}</p>`,
      ctaLabel: "Abrir en el panel",
      ctaHref: `${SITE}/admin`,
    }),
  });
}

/** Aviso al usuario de un cambio de estado relevante (en_revision, preaprobada). */
export async function notifyStatusChange(
  to: string,
  folio: string,
  status: ApplicationStatus,
) {
  const label = APPLICATION_STATUS_LABELS[status];
  const mensajes: Partial<Record<ApplicationStatus, string>> = {
    en_revision:
      "Estamos validando la información y la documentación de tu activo.",
    preaprobada:
      "Tu solicitud fue preaprobada. Pronto coordinaremos los siguientes pasos.",
  };
  await sendEmail({
    to,
    subject: `Actualización de tu solicitud · #${folio}`,
    html: baseEmail({
      preheader: `Tu solicitud ${folio} cambió a ${label}.`,
      heading: `Tu solicitud está ${label.toLowerCase()}.`,
      body: `<p style="margin:0 0 14px">Tu solicitud <strong style="color:#f4f4f3">#${folio}</strong> ahora se encuentra en estado <strong style="color:#f4f4f3">${label}</strong>.</p>
             <p style="margin:0">${mensajes[status] ?? ""}</p>`,
      ctaLabel: "Ver mi solicitud",
      ctaHref: `${SITE}/panel`,
    }),
  });
}
