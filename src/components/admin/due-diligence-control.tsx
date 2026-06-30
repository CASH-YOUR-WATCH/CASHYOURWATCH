"use client";

import { useActionState } from "react";
import { updateDueDiligence, type AdminActionState } from "@/lib/admin/actions";
import {
  DUE_DILIGENCE_VALUES,
  DUE_DILIGENCE_LABELS,
  dueDiligenceSearchLinks,
  type DueDiligence,
} from "@/lib/applications";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

const DOT: Record<DueDiligence, string> = {
  pendiente: "bg-cyw-white/40",
  verificado: "bg-emerald-400",
  alerta: "bg-red-400",
};

export function DueDiligenceControl({
  applicationId,
  current,
  marca,
  modelo,
  referencia,
}: {
  applicationId: string;
  current: DueDiligence;
  marca: string;
  modelo: string;
  referencia: string | null;
}) {
  const [state, action, pending] = useActionState(updateDueDiligence, initial);
  const links = dueDiligenceSearchLinks({ marca, modelo, referencia });

  return (
    <div className="space-y-6">
      <p className="text-xs leading-relaxed text-cyw-white/45">
        Verifica la procedencia de la pieza en las fuentes de referencia. Los
        enlaces abren la búsqueda con los datos del reloj ya cargados.
      </p>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-cyw-white/12 bg-cyw-white/[0.02] p-3.5 transition-colors hover:border-cyw-white/40"
          >
            <span className="flex items-center justify-between text-sm text-cyw-white/85">
              {l.label}
              <span className="text-cyw-white/30 transition-colors group-hover:text-cyw-white">
                ↗
              </span>
            </span>
            <span className="mt-1 block text-[11px] leading-relaxed text-cyw-white/40">
              {l.nota}
            </span>
          </a>
        ))}
      </div>

      <form action={action} className="flex flex-wrap items-center gap-3 border-t border-cyw-white/10 pt-6">
        <input type="hidden" name="applicationId" value={applicationId} />
        <span className={`h-2 w-2 rounded-full ${DOT[current]}`} aria-hidden />
        <select
          name="dueDiligence"
          defaultValue={current}
          className="border border-cyw-white/20 bg-cyw-black px-4 py-2.5 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
        >
          {DUE_DILIGENCE_VALUES.map((v) => (
            <option key={v} value={v}>
              {DUE_DILIGENCE_LABELS[v]}
            </option>
          ))}
        </select>
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        {state.ok && <span className="text-xs text-emerald-300">Guardado ✓</span>}
        {state.error && <span className="text-xs text-red-300">{state.error}</span>}
      </form>
    </div>
  );
}
