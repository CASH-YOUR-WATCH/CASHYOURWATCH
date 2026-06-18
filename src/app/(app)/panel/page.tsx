import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/panel/status-badge";
import { formatDateShort, formatMoney } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/applications";

export const metadata: Metadata = { title: "Mis solicitudes" };

type Row = {
  id: string;
  folio: string;
  marca: string;
  modelo: string;
  monto_deseado: number | null;
  status: ApplicationStatus;
  created_at: string;
};

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("applications")
    .select("id, folio, marca, modelo, monto_deseado, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const apps = (data ?? []) as Row[];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 border-b border-cyw-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Tu cuenta
          </p>
          <h1 className="mt-2 font-serif text-3xl text-cyw-white">
            Mis solicitudes
          </h1>
        </div>
        <Link href="/solicitud" className="shrink-0">
          <Button size="sm">Nueva solicitud</Button>
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="mt-16 border border-dashed border-cyw-white/15 py-20 text-center">
          <p className="font-serif text-2xl text-cyw-white/80">
            Aún no tienes solicitudes
          </p>
          <p className="mx-auto mt-3 max-w-sm text-sm text-cyw-white/50">
            Inicia tu primera evaluación y da seguimiento a su estado desde aquí.
          </p>
          <Link href="/solicitud" className="mt-8 inline-block">
            <Button>Solicitar evaluación</Button>
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-cyw-white/10">
          {apps.map((a) => (
            <li key={a.id}>
              <Link
                href={`/panel/${a.id}`}
                className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-cyw-white/[0.02]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-cyw-white">
                      #{a.folio}
                    </span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-cyw-white/60">
                    {a.marca} {a.modelo}
                  </p>
                  <p className="mt-0.5 text-xs text-cyw-white/35">
                    {formatDateShort(a.created_at)} · {formatMoney(a.monto_deseado)}
                  </p>
                </div>
                <span className="text-cyw-white/30 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
