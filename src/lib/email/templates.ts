/**
 * Plantillas de correo on-brand (oscuras, sobrias). HTML inline + tablas para
 * compatibilidad con clientes de correo. Tipografías de sistema (serif/Arial)
 * porque las fuentes custom no cargan en email.
 */

const BG = "#0B0F14";
const FG = "#f4f4f3";
const MUTED = "#9a9a98";
const LINE = "rgba(255,255,255,0.12)";

export function baseEmail(opts: {
  preheader?: string;
  heading: string;
  body: string; // HTML
  ctaLabel?: string;
  ctaHref?: string;
}): string {
  const { preheader = "", heading, body, ctaLabel, ctaHref } = opts;
  const cta =
    ctaLabel && ctaHref
      ? `<tr><td style="padding-top:28px">
           <a href="${ctaHref}" style="display:inline-block;background:${FG};color:${BG};text-decoration:none;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:14px 26px">${ctaLabel}</a>
         </td></tr>`
      : "";

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:${BG};">
  <span style="display:none;opacity:0;color:${BG};font-size:1px;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:28px;border-bottom:1px solid ${LINE};">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:${FG};letter-spacing:1px;">CYW</span>
          <span style="font-family:Arial,sans-serif;font-size:10px;color:${MUTED};letter-spacing:3px;text-transform:uppercase;padding-left:10px;">Cash Your Watch</span>
        </td></tr>
        <tr><td style="padding-top:36px;">
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:28px;line-height:1.2;color:${FG};">${heading}</h1>
        </td></tr>
        <tr><td style="padding-top:18px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:${MUTED};">
          ${body}
        </td></tr>
        ${cta}
        <tr><td style="padding-top:44px;margin-top:24px;border-top:1px solid ${LINE};">
          <p style="font-family:Arial,sans-serif;font-size:11px;line-height:1.6;color:${MUTED};opacity:0.7;">
            Cash Your Watch — Capital inteligente respaldado por activos de lujo.<br>
            Este es un correo automático, por favor no respondas a este mensaje.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
