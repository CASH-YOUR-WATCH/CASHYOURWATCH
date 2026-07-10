"use client";

import { useActionState, useMemo } from "react";
import {
  requestExistenceProof,
  type AdminActionState,
} from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

// datetime-local necesita "YYYY-MM-DDTHH:mm" en hora local.
function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function ExistenceProofControl({
  applicationId,
}: {
  applicationId: string;
}) {
  const [state, action, pending] = useActionState(
    requestExistenceProof,
    initial,
  );

  const { defStart, defEnd } = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return { defStart: toLocalInput(now), defEnd: toLocalInput(end) };
  }, []);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-cyw-white/40">
            Desde
          </span>
          <input
            type="datetime-local"
            name="windowStart"
            defaultValue={defStart}
            className="w-full border border-cyw-white/20 bg-cyw-black px-3 py-2 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-cyw-white/40">
            Hasta
          </span>
          <input
            type="datetime-local"
            name="windowEnd"
            defaultValue={defEnd}
            className="w-full border border-cyw-white/20 bg-cyw-black px-3 py-2 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
          />
        </label>
      </div>
      <textarea
        name="instrucciones"
        rows={2}
        placeholder="Instrucciones (opcional): p. ej. foto del reloj junto a un papel con la fecha de hoy escrita a mano."
        className="w-full resize-none border border-cyw-white/20 bg-transparent px-3 py-2 text-sm text-cyw-white placeholder:text-cyw-white/30 focus:border-cyw-white/60 focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Solicitando…" : "Solicitar prueba"}
        </Button>
        {state.ok && (
          <span className="text-xs text-emerald-300">Solicitada ✓</span>
        )}
        {state.error && (
          <span className="text-xs text-red-300">{state.error}</span>
        )}
      </div>
    </form>
  );
}
