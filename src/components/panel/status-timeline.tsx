import {
  APPLICATION_STATUS_FLOW,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications";
import { formatDate } from "@/lib/format";

type HistoryEntry = { status: ApplicationStatus; created_at: string };

const STEP_DESC: Record<ApplicationStatus, string> = {
  recibida: "Tu solicitud llegó a nuestro equipo.",
  en_revision: "Validando la documentación.",
  preaprobada: "Aprobación preliminar de tu solicitud.",
  cita_agendada: "Inspección física y autenticación.",
  formalizada: "Acuerdo concretado y acceso al capital.",
  rechazada: "La solicitud no procedió.",
};

export function StatusTimeline({
  current,
  history,
}: {
  current: ApplicationStatus;
  history: HistoryEntry[];
}) {
  const dateFor = (s: ApplicationStatus) =>
    history.find((h) => h.status === s)?.created_at;

  const rejected = current === "rechazada";
  const currentIdx = APPLICATION_STATUS_FLOW.indexOf(current);

  return (
    <ol className="relative">
      {APPLICATION_STATUS_FLOW.map((s, i) => {
        const date = dateFor(s);
        const reached = Boolean(date) || (!rejected && i <= currentIdx);
        const isCurrent = !rejected && s === current;
        const last = i === APPLICATION_STATUS_FLOW.length - 1;

        return (
          <li key={s} className="relative flex gap-5 pb-9 last:pb-0">
            {/* Línea conectora */}
            {!last && (
              <span
                className={`absolute left-[7px] top-4 h-full w-px ${
                  reached ? "bg-cyw-white/40" : "bg-cyw-white/10"
                }`}
              />
            )}
            {/* Nodo */}
            <span
              className={`relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                isCurrent
                  ? "border-cyw-white bg-cyw-white"
                  : reached
                    ? "border-cyw-white/60 bg-cyw-white/60"
                    : "border-cyw-white/20 bg-transparent"
              }`}
            >
              {isCurrent && (
                <span className="absolute h-6 w-6 animate-ping rounded-full bg-cyw-white/20" />
              )}
            </span>

            <div className="-mt-0.5">
              <p
                className={`text-sm uppercase tracking-[0.12em] ${
                  reached ? "text-cyw-white" : "text-cyw-white/35"
                }`}
              >
                {APPLICATION_STATUS_LABELS[s]}
              </p>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  reached ? "text-cyw-white/50" : "text-cyw-white/25"
                }`}
              >
                {STEP_DESC[s]}
              </p>
              {date && (
                <p className="mt-1.5 text-[11px] tracking-wide text-cyw-white/40">
                  {formatDate(date)}
                </p>
              )}
            </div>
          </li>
        );
      })}

      {rejected && (
        <li className="relative flex gap-5">
          <span className="relative z-10 mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-red-400/60 bg-red-400/60" />
          <div className="-mt-0.5">
            <p className="text-sm uppercase tracking-[0.12em] text-red-300/90">
              {APPLICATION_STATUS_LABELS.rechazada}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-cyw-white/50">
              {STEP_DESC.rechazada}
            </p>
            {dateFor("rechazada") && (
              <p className="mt-1.5 text-[11px] tracking-wide text-cyw-white/40">
                {formatDate(dateFor("rechazada"))}
              </p>
            )}
          </div>
        </li>
      )}
    </ol>
  );
}
