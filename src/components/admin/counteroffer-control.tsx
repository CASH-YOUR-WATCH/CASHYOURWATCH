"use client";

import { useActionState } from "react";
import { sendCounteroffer, type AdminActionState } from "@/lib/admin/actions";
import {
  CONTRAOFERTA_LABELS,
  type ContraofertaStatus,
} from "@/lib/logistics";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

export function CounterofferControl({
  applicationId,
  status,
  monto,
}: {
  applicationId: string;
  status: ContraofertaStatus;
  monto: number | null;
}) {
  const [state, action, pending] = useActionState(sendCounteroffer, initial);

  return (
    <div className="space-y-4">
      {status !== "ninguna" && (
        <p className="text-sm text-cyw-white/70">
          {CONTRAOFERTA_LABELS[status]}
          {monto ? ` · ${formatMoney(monto)}` : ""}
        </p>
      )}
      <form action={action} className="flex flex-wrap items-end gap-3">
        <input type="hidden" name="applicationId" value={applicationId} />
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-cyw-white/40">
            Monto a prestar (MXN)
          </span>
          <input
            type="number"
            name="monto"
            min="0"
            defaultValue={monto ?? ""}
            className="w-44 border border-cyw-white/20 bg-cyw-black px-3 py-2 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
          />
        </label>
        <Button size="sm" type="submit" disabled={pending}>
          {pending
            ? "Enviando…"
            : status === "ninguna"
              ? "Enviar contraoferta"
              : "Reenviar"}
        </Button>
        {state.ok && <span className="text-xs text-emerald-300">Enviada ✓</span>}
        {state.error && (
          <span className="text-xs text-red-300">{state.error}</span>
        )}
      </form>
    </div>
  );
}
