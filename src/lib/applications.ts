/**
 * Contrato compartido entre la base de datos y la UI para las solicitudes.
 * Debe mantenerse en sync con el enum `application_status` y los CHECK de la
 * migración SQL (supabase/migrations).
 */

// --- Status de la solicitud (enum public.application_status) ----------------
export const APPLICATION_STATUSES = [
  "recibida",
  "en_revision",
  "preaprobada",
  "cita_agendada",
  "formalizada",
  "rechazada",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Etiqueta legible (timeline del usuario y panel admin). */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  recibida: "Solicitud recibida",
  en_revision: "En revisión",
  preaprobada: "Preaprobada",
  cita_agendada: "Cita de validación física",
  formalizada: "Formalizada",
  rechazada: "Rechazada",
};

/** Orden del flujo feliz (sin contar 'rechazada', que es terminal alterno). */
export const APPLICATION_STATUS_FLOW: ApplicationStatus[] = [
  "recibida",
  "en_revision",
  "preaprobada",
  "cita_agendada",
  "formalizada",
];

// --- Debida diligencia / verificación de procedencia (applications.due_diligence) ---
export const DUE_DILIGENCE_VALUES = [
  "pendiente",
  "verificado",
  "alerta",
] as const;
export type DueDiligence = (typeof DUE_DILIGENCE_VALUES)[number];

export const DUE_DILIGENCE_LABELS: Record<DueDiligence, string> = {
  pendiente: "Pendiente de verificar",
  verificado: "Procedencia verificada",
  alerta: "Alerta — requiere atención",
};

/**
 * Enlaces de búsqueda para la debida diligencia. No existe una API pública y
 * gratuita de relojes robados; estos abren las fuentes profesionales/públicas
 * más útiles, prellenadas con los datos de la pieza, para revisión manual.
 */
export function dueDiligenceSearchLinks(opts: {
  marca: string;
  modelo: string;
  referencia?: string | null;
}): { label: string; url: string; nota: string }[] {
  const ref = (opts.referencia ?? "").trim();
  const q = [opts.marca, opts.modelo, ref].filter(Boolean).join(" ").trim();
  const enc = encodeURIComponent;
  return [
    {
      label: "The Watch Register",
      url: "https://www.thewatchregister.com/",
      nota: "Mayor registro internacional de relojes robados/perdidos (Art Loss Register). Búsqueda profesional por número de serie.",
    },
    {
      label: "Chrono24",
      url: `https://www.chrono24.com/search/index.htm?query=${enc(q || opts.marca)}`,
      nota: "Verifica que la referencia exista y compara precio de mercado.",
    },
    {
      label: "WatchBase",
      url: `https://watchbase.com/search?q=${enc(ref || `${opts.marca} ${opts.modelo}`)}`,
      nota: "Confirma que la referencia corresponde a la marca/modelo declarados.",
    },
    {
      label: "Búsqueda web",
      url: `https://www.google.com/search?q=${enc(`${q} (robado OR stolen OR reportado)`)}`,
      nota: "Menciones públicas de robo o reporte de la pieza.",
    },
  ];
}

// --- Estado físico del reloj (CHECK en applications.estado_reloj) -----------
export const WATCH_CONDITIONS = ["excelente", "bueno", "regular"] as const;
export type WatchCondition = (typeof WATCH_CONDITIONS)[number];

export const WATCH_CONDITION_LABELS: Record<WatchCondition, string> = {
  excelente: "Excelente",
  bueno: "Bueno",
  regular: "Regular",
};

// --- Tipos de archivo (CHECK en application_files.tipo) ---------------------
export const PHOTO_TYPES = [
  "foto_frontal",
  "foto_trasera",
  "foto_lateral",
  "foto_cierre",
  "foto_serie",
] as const;

export const DOCUMENT_TYPES = [
  "doc_factura",
  "doc_certificado",
  "doc_garantia",
  "doc_propiedad",
] as const;

export const FILE_TYPES = [...PHOTO_TYPES, ...DOCUMENT_TYPES] as const;
export type FileType = (typeof FILE_TYPES)[number];

export const FILE_TYPE_LABELS: Record<FileType, string> = {
  foto_frontal: "Foto frontal",
  foto_trasera: "Foto trasera",
  foto_lateral: "Foto lateral",
  foto_cierre: "Foto del cierre",
  foto_serie: "Foto del número de serie",
  doc_factura: "Factura",
  doc_certificado: "Certificado",
  doc_garantia: "Garantía",
  doc_propiedad: "Prueba de propiedad",
};
