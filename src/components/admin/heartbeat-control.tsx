"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";

export function HeartbeatControl({ lastPing }: { lastPing: string | null }) {
  const [ping, setPing] = useState<string | null>(lastPing);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function trigger() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/heartbeat", { method: "POST" });
      if (res.ok) {
        setPing(new Date().toISOString());
        setMsg("Base reactivada ✓");
      } else {
        setMsg("No autorizado.");
      }
    } catch {
      setMsg("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 border border-cyw-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-cyw-white/40">
          Mantenimiento de la base
        </p>
        <p className="mt-2 text-sm text-cyw-white/70">
          Última actividad:{" "}
          <span className="text-cyw-white">{formatDateTime(ping)}</span>
        </p>
        {msg && <p className="mt-1 text-xs text-emerald-300">{msg}</p>}
      </div>
      <Button size="sm" variant="outline" onClick={trigger} disabled={loading}>
        {loading ? "Reactivando…" : "Mantener activa la base"}
      </Button>
    </div>
  );
}
