"use client";

import { useActionState } from "react";
import {
  registerGuia,
  addLogisticsEvent,
  type AdminActionState,
} from "@/lib/admin/actions";
import { LOGISTICS_STAGES, LOGISTICS_LABELS } from "@/lib/logistics";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

const inputCls =
  "w-full border border-cyw-white/20 bg-cyw-black px-3 py-2 text-sm text-cyw-white placeholder:text-cyw-white/30 focus:border-cyw-white/60 focus:outline-none";

export function LogisticsControl({
  applicationId,
  guiaPaqueteria,
  guiaTracking,
  montoAsegurado,
  valorEstimado,
  hasGuia,
}: {
  applicationId: string;
  guiaPaqueteria: string | null;
  guiaTracking: string | null;
  montoAsegurado: number | null;
  valorEstimado: number | null;
  hasGuia: boolean;
}) {
  const [guiaState, guiaAction, guiaPending] = useActionState(
    registerGuia,
    initial,
  );
  const [eventState, eventAction, eventPending] = useActionState(
    addLogisticsEvent,
    initial,
  );

  return (
    <div className="space-y-8">
      {/* Registrar / actualizar guía */}
      <form action={guiaAction} className="space-y-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyw-white/40">
          {hasGuia ? "Actualizar guía" : "Registrar guía"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="paqueteria"
            placeholder="Paquetería (DHL, FedEx…)"
            defaultValue={guiaPaqueteria ?? ""}
            className={inputCls}
          />
          <input
            name="tracking"
            placeholder="Número de rastreo"
            defaultValue={guiaTracking ?? ""}
            className={inputCls}
          />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-cyw-white/40">
            Monto asegurado (MXN)
          </span>
          <input
            type="number"
            name="asegurado"
            min="0"
            defaultValue={montoAsegurado ?? valorEstimado ?? ""}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-cyw-white/40">
            Guía (PDF, opcional)
          </span>
          <input
            type="file"
            name="guia"
            accept="application/pdf,image/*"
            className="block w-full text-xs text-cyw-white/60 file:mr-3 file:border file:border-cyw-white/20 file:bg-transparent file:px-3 file:py-1.5 file:text-xs file:text-cyw-white/80"
          />
        </label>
        <div className="flex items-center gap-3">
          <Button size="sm" type="submit" disabled={guiaPending}>
            {guiaPending ? "Guardando…" : "Guardar guía"}
          </Button>
          {guiaState.ok && (
            <span className="text-xs text-emerald-300">Guardada ✓</span>
          )}
          {guiaState.error && (
            <span className="text-xs text-red-300">{guiaState.error}</span>
          )}
        </div>
      </form>

      {/* Avanzar etapa del envío */}
      <form
        action={eventAction}
        className="space-y-3 border-t border-cyw-white/10 pt-6"
      >
        <input type="hidden" name="applicationId" value={applicationId} />
        <p className="text-[11px] uppercase tracking-[0.2em] text-cyw-white/40">
          Registrar movimiento
        </p>
        <select name="etapa" defaultValue="en_transito" className={inputCls}>
          {LOGISTICS_STAGES.map((s) => (
            <option key={s} value={s}>
              {LOGISTICS_LABELS[s]}
            </option>
          ))}
        </select>
        <input name="nota" placeholder="Nota (opcional)" className={inputCls} />
        <div className="flex items-center gap-3">
          <Button size="sm" type="submit" disabled={eventPending}>
            {eventPending ? "Registrando…" : "Registrar movimiento"}
          </Button>
          {eventState.ok && (
            <span className="text-xs text-emerald-300">Registrado ✓</span>
          )}
          {eventState.error && (
            <span className="text-xs text-red-300">{eventState.error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
