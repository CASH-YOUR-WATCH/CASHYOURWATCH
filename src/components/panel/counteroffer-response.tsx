"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { respondCounteroffer } from "@/lib/logistics/actions";

export function CounterofferResponse({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function respond(accept: boolean) {
    setError("");
    startTransition(async () => {
      const res = await respondCounteroffer(applicationId, accept);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => respond(true)}
          className="border border-cyw-white bg-cyw-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-cyw-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Enviando…" : "Aceptar contraoferta"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => respond(false)}
          className="border border-cyw-white/25 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-cyw-white/70 transition-colors hover:border-cyw-white/50 disabled:opacity-50"
        >
          Rechazar
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
