"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNote, type AdminActionState } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";

const initial: AdminActionState = {};

export function AddNote({ applicationId }: { applicationId: string }) {
  const [state, action, pending] = useActionState(addNote, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <textarea
        name="nota"
        rows={3}
        required
        placeholder="Escribe una nota interna…"
        className="w-full resize-none border border-cyw-white/20 bg-transparent px-4 py-3 text-sm text-cyw-white placeholder:text-cyw-white/30 focus:border-cyw-white/60 focus:outline-none"
      />
      <div className="flex items-center gap-3">
        <Button size="sm" type="submit" disabled={pending}>
          {pending ? "Guardando…" : "Agregar nota"}
        </Button>
        {state.error && <span className="text-xs text-red-300">{state.error}</span>}
      </div>
    </form>
  );
}
