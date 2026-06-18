import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminFilters } from "@/components/admin/admin-filters";
import { HeartbeatControl } from "@/components/admin/heartbeat-control";
import { StatusBadge } from "@/components/panel/status-badge";
import { formatDateShort, formatMoney } from "@/lib/format";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/applications";

export const metadata: Metadata = { title: "Admin — Solicitudes" };

export default async function AdminListPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>;
}) {
  await requireAdmin();
  const { estado, q } = await searchParams;

  const supabase = createAdminClient();
  let query = supabase
    .from("applications")
    .select(
      "id, folio, marca, modelo, monto_deseado, status, created_at, user_id",
    )
    .order("created_at", { ascending: false });

  if (estado && APPLICATION_STATUSES.includes(estado as ApplicationStatus)) {
    query = query.eq("status", estado as ApplicationStatus);
  }
  if (q) {
    const safe = q.replace(/[,()*]/g, " ").trim();
    if (safe) {
      query = query.or(
        `folio.ilike.%${safe}%,marca.ilike.%${safe}%,modelo.ilike.%${safe}%`,
      );
    }
  }

  const { data: apps } = await query;
  const rows = apps ?? [];

  // Nombres de los solicitantes (lookup por user_id).
  const ids = [...new Set(rows.map((r) => r.user_id))];
  const { data: profs } = ids.length
    ? await supabase.from("profiles").select("id, nombre").in("id", ids)
    : { data: [] };
  const nameById = new Map((profs ?? []).map((p) => [p.id, p.nombre]));

  const { data: hb } = await supabase
    .from("heartbeat")
    .select("last_ping")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="border-b border-cyw-white/10 pb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
          Panel administrativo
        </p>
        <h1 className="mt-2 font-serif text-3xl text-cyw-white">Solicitudes</h1>
        <p className="mt-1 text-sm text-cyw-white/40">
          {rows.length} {rows.length === 1 ? "solicitud" : "solicitudes"}
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <AdminFilters />
        </Suspense>
      </div>

      {rows.length === 0 ? (
        <p className="mt-16 text-center text-sm text-cyw-white/40">
          No hay solicitudes que coincidan.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-cyw-white/10 text-left text-[10px] uppercase tracking-[0.2em] text-cyw-white/40">
                <th className="py-3 pr-4 font-normal">Folio</th>
                <th className="py-3 pr-4 font-normal">Solicitante</th>
                <th className="py-3 pr-4 font-normal">Reloj</th>
                <th className="py-3 pr-4 font-normal">Monto</th>
                <th className="py-3 pr-4 font-normal">Fecha</th>
                <th className="py-3 pr-4 font-normal">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-cyw-white/[0.07] transition-colors hover:bg-cyw-white/[0.02]"
                >
                  <td className="py-4 pr-4">
                    <Link
                      href={`/admin/${a.id}`}
                      className="font-serif text-base text-cyw-white hover:underline"
                    >
                      #{a.folio}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-cyw-white/70">
                    {nameById.get(a.user_id) ?? "—"}
                  </td>
                  <td className="py-4 pr-4 text-cyw-white/70">
                    {a.marca} {a.modelo}
                  </td>
                  <td className="py-4 pr-4 text-cyw-white/70">
                    {formatMoney(a.monto_deseado)}
                  </td>
                  <td className="py-4 pr-4 text-cyw-white/50">
                    {formatDateShort(a.created_at)}
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={a.status as ApplicationStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-16">
        <HeartbeatControl lastPing={hb?.last_ping ?? null} />
      </div>
    </div>
  );
}
