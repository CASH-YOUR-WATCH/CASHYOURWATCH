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

// Evidencia de accesorios (condicional a lo que el dueño declare tener).
export const ACCESSORY_EVIDENCE_TYPES = [
  "evidencia_caja",
  "evidencia_papeles",
  "evidencia_ajustadores",
  "evidencia_full_set",
] as const;

// Evidencia de empaque (antifraude, se sube antes de enviar el reloj).
export const PACKAGING_TYPES = [
  "empaque_reloj",
  "empaque_contenido",
  "empaque_sellado",
] as const;

export const FILE_TYPES = [
  ...PHOTO_TYPES,
  ...DOCUMENT_TYPES,
  ...ACCESSORY_EVIDENCE_TYPES,
  ...PACKAGING_TYPES,
] as const;
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
  evidencia_caja: "Evidencia — caja",
  evidencia_papeles: "Evidencia — papeles",
  evidencia_ajustadores: "Evidencia — ajustadores",
  evidencia_full_set: "Evidencia — full set",
  empaque_reloj: "Reloj antes de empacar",
  empaque_contenido: "Contenido del paquete",
  empaque_sellado: "Paquete sellado",
};

// Fotos que el propietario sube como protocolo de empaque, con su descripción.
export const PACKAGING_ITEMS = [
  {
    tipo: "empaque_reloj",
    hint: "El reloj y sus accesorios antes de guardarlos.",
  },
  {
    tipo: "empaque_contenido",
    hint: "Todo dentro de la caja, antes de cerrarla.",
  },
  {
    tipo: "empaque_sellado",
    hint: "El paquete ya cerrado y sellado, tal como irá a la paquetería.",
  },
] as const;

// Accesorios que se preguntan (sí/no) con su evidencia condicional.
export const ACCESSORIES = [
  {
    key: "tiene_caja",
    pregunta: "¿Tienes la caja original?",
    corto: "Caja",
    evidencia: "evidencia_caja",
  },
  {
    key: "tiene_papeles",
    pregunta: "¿Tienes los papeles o certificado?",
    corto: "Papeles",
    evidencia: "evidencia_papeles",
  },
  {
    key: "tiene_ajustadores",
    pregunta: "¿Tienes el set de ajustadores o eslabones?",
    corto: "Ajustadores",
    evidencia: "evidencia_ajustadores",
  },
  {
    key: "full_set",
    pregunta: "¿Es un full set (todo completo)?",
    corto: "Full set",
    evidencia: "evidencia_full_set",
  },
] as const;

export type AccessoryKey = (typeof ACCESSORIES)[number]["key"];
