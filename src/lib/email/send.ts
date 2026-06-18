import "server-only";

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
};

/**
 * Transporte de correo DESACOPLADO. Elige según las variables de entorno:
 *   1. RESEND_API_KEY            → envía vía Resend
 *   2. N8N_EMAIL_WEBHOOK_URL     → hace POST a un webhook de n8n (n8n envía)
 *   3. ninguno                   → no-op (solo log); la app sigue funcionando
 *
 * NUNCA lanza excepción: un fallo de correo no debe romper el flujo principal.
 */
export async function sendEmail({ to, subject, html }: SendArgs): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const n8nUrl = process.env.N8N_EMAIL_WEBHOOK_URL;
  const from =
    process.env.EMAIL_FROM ?? "Cash Your Watch <onboarding@resend.dev>";

  try {
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (!res.ok) {
        console.error("[email] Resend respondió error:", await res.text());
        return false;
      }
      return true;
    }

    if (n8nUrl) {
      const res = await fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, subject, html }),
      });
      if (!res.ok) {
        console.error("[email] webhook n8n respondió error:", res.status);
        return false;
      }
      return true;
    }

    console.warn(
      `[email] Sin transporte configurado (RESEND_API_KEY / N8N_EMAIL_WEBHOOK_URL). Correo omitido: "${subject}"`,
    );
    return false;
  } catch (err) {
    console.error("[email] fallo al enviar:", err);
    return false;
  }
}
