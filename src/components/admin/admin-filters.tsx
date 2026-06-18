"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
} from "@/lib/applications";
import { Button } from "@/components/ui/button";

export function AdminFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const estado = sp.get("estado") ?? "";

  function apply(next: Record<string, string>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply({ q });
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por folio o marca…"
        className="w-full flex-1 border border-cyw-white/20 bg-transparent px-4 py-2.5 text-sm text-cyw-white placeholder:text-cyw-white/30 focus:border-cyw-white/60 focus:outline-none"
      />
      <select
        value={estado}
        onChange={(e) => apply({ estado: e.target.value })}
        className="border border-cyw-white/20 bg-cyw-black px-4 py-2.5 text-sm text-cyw-white focus:border-cyw-white/60 focus:outline-none"
      >
        <option value="">Todos los estados</option>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {APPLICATION_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <Button size="sm" type="submit">
        Buscar
      </Button>
    </form>
  );
}
