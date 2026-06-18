"use client";

import { useActionState } from "react";
import { updateStatus, type AdminActionState } from "@/lib/admin/actions";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/applications";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

export function StatusControl({
  applicationId,
  current,
}: {
  applicationId: string;
  current: ApplicationStatus;
}) {
  const [state, action, pending] = useActionState(updateStatus, initial);

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <select
        name="status"
        defaultValue={current}
        className="border border-cyw-white/20 bg-cyw-black px-4 py-2.5 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {APPLICATION_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <Button size="sm" type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Actualizar"}
      </Button>
      {state.ok && <span className="text-xs text-emerald-300">Actualizado ✓</span>}
      {state.error && <span className="text-xs text-red-300">{state.error}</span>}
    </form>
  );
}
