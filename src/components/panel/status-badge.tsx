import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications";

// Monocromático (marca), con excepciones semánticas mínimas para los estados
// terminales: formalizada (positivo) y rechazada (rojo contenido).
const STYLES: Record<ApplicationStatus, string> = {
  recibida: "border-cyw-white/25 text-cyw-white/70",
  en_revision: "border-cyw-white/40 text-cyw-white/85",
  preaprobada: "border-cyw-white/60 text-cyw-white",
  cita_agendada: "border-cyw-white/60 text-cyw-white",
  formalizada: "border-cyw-white bg-cyw-white/10 text-cyw-white",
  rechazada: "border-red-400/40 text-red-300/90",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${STYLES[status]} ${className}`}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
