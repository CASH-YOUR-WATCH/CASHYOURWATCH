/**
 * Contrato compartido de la Fase 3: contraoferta y logística de envío.
 * Debe mantenerse en sync con los CHECK de la migración 20260710140000.
 */

// --- Contraoferta -----------------------------------------------------------
export const CONTRAOFERTA_STATUSES = [
  "ninguna",
  "pendiente",
  "aceptada",
  "rechazada",
] as const;
export type ContraofertaStatus = (typeof CONTRAOFERTA_STATUSES)[number];

export const CONTRAOFERTA_LABELS: Record<ContraofertaStatus, string> = {
  ninguna: "Sin contraoferta",
  pendiente: "Contraoferta enviada — esperando respuesta",
  aceptada: "Contraoferta aceptada",
  rechazada: "Contraoferta rechazada",
};

// --- Etapas del envío (bitácora logistics_events) ---------------------------
export const LOGISTICS_STAGES = [
  "guia_generada",
  "en_transito",
  "recibido",
  "inspeccion",
  "aprobado",
  "rechazado",
  "devuelto",
] as const;
export type LogisticsStage = (typeof LOGISTICS_STAGES)[number];

/** Flujo feliz, en orden, para pintar el timeline. */
export const LOGISTICS_FLOW: LogisticsStage[] = [
  "guia_generada",
  "en_transito",
  "recibido",
  "inspeccion",
  "aprobado",
];

export const LOGISTICS_LABELS: Record<LogisticsStage, string> = {
  guia_generada: "Guía generada",
  en_transito: "En tránsito",
  recibido: "Reloj recibido",
  inspeccion: "Inspección física",
  aprobado: "Aprobado",
  rechazado: "Rechazado en inspección",
  devuelto: "Devuelto al propietario",
};

export const LOGISTICS_DESC: Record<LogisticsStage, string> = {
  guia_generada: "Se generó tu guía de envío asegurada.",
  en_transito: "El reloj va en camino a Cash Your Watch.",
  recibido: "Recibimos el paquete con tu reloj.",
  inspeccion: "Estamos validando físicamente el reloj.",
  aprobado: "Tu reloj fue aprobado. Se procede a formalizar.",
  rechazado: "La revisión física no coincidió con lo declarado.",
  devuelto: "Tu reloj fue devuelto a tu domicilio.",
};

/** Aviso de costos logísticos (informativo — la plataforma no cobra). */
export const COSTOS_AVISO =
  "La guía y los gastos operativos son financiados inicialmente por Cash Your Watch. " +
  "Si tu reloj es aprobado, estos costos se descuentan del monto del préstamo. " +
  "Si la revisión física no coincide con lo mostrado en tu solicitud, el envío no procede " +
  "y el propietario cubre la guía anterior y una nueva guía de regreso para recibir su reloj.";

/** Protocolo de empaque antifraude (aviso que ve el propietario). */
export const EMPAQUE_AVISO =
  "Para proteger a ambas partes, documenta el empaque de tu reloj con las fotos que se " +
  "piden abajo. Al recibirlo, Cash Your Watch grabará en video la apertura del paquete " +
  "para cotejar que la caja y el contenido son los mismos. Ese video no se sube aquí, pero " +
  "podrá usarse como evidencia ante cualquier reclamación. Sube estas fotos antes de enviar.";
