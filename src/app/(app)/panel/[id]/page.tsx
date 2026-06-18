import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/panel/status-badge";
import { StatusTimeline } from "@/components/panel/status-timeline";
import { formatMoney } from "@/lib/format";
import {
  WATCH_CONDITION_LABELS,
  FILE_TYPE_LABELS,
  PHOTO_TYPES,
  type ApplicationStatus,
  type WatchCondition,
  type FileType,
} from "@/lib/applications";

export const metadata: Metadata = { title: "Detalle de solicitud" };

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: app } = await supabase
    .from("applications")
    .select(
      "id, folio, marca, modelo, estado_reloj, valor_estimado, monto_deseado, status, created_at",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!app) notFound();

  const { data: history } = await supabase
    .from("application_status_history")
    .select("status, created_at")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const { data: fileRows } = await supabase
    .from("application_files")
    .select("tipo, storage_path")
    .eq("application_id", id);

  // Signed URLs (corta expiración) para mostrar los archivos del propio usuario.
  const files = await Promise.all(
    (fileRows ?? []).map(async (f) => {
      const { data } = await supabase.storage
        .from("application-files")
        .createSignedUrl(f.storage_path, 600);
      return {
        tipo: f.tipo as FileType,
        url: data?.signedUrl ?? null,
        isPhoto: (PHOTO_TYPES as readonly string[]).includes(f.tipo),
      };
    }),
  );
  const fotos = files.filter((f) => f.isPhoto && f.url);
  const docs = files.filter((f) => !f.isPhoto && f.url);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/panel"
        className="text-xs uppercase tracking-[0.2em] text-cyw-white/50 transition-colors hover:text-cyw-white"
      >
        ← Mis solicitudes
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-cyw-white/10 pb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Solicitud
          </p>
          <h1 className="mt-2 font-serif text-4xl text-cyw-white">
            #{app.folio}
          </h1>
        </div>
        <StatusBadge status={app.status as ApplicationStatus} />
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Resumen del reloj */}
        <div>
          <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            El reloj
          </h2>
          <dl className="divide-y divide-cyw-white/10 border-y border-cyw-white/10 text-sm">
            <Dato k="Marca" v={app.marca} />
            <Dato k="Modelo" v={app.modelo} />
            <Dato
              k="Estado"
              v={WATCH_CONDITION_LABELS[app.estado_reloj as WatchCondition]}
            />
            <Dato k="Valor estimado" v={formatMoney(app.valor_estimado)} />
            <Dato k="Monto deseado" v={formatMoney(app.monto_deseado)} />
          </dl>

          {fotos.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
                Fotografías
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {fotos.map((f) => (
                  <a
                    key={f.tipo}
                    href={f.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square overflow-hidden border border-cyw-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.url!}
                      alt={FILE_TYPE_LABELS[f.tipo]}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {docs.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
                Documentos
              </h3>
              <ul className="space-y-2">
                {docs.map((f) => (
                  <li key={f.tipo}>
                    <a
                      href={f.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyw-white/70 underline-offset-4 hover:text-cyw-white hover:underline"
                    >
                      {FILE_TYPE_LABELS[f.tipo]} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h2 className="mb-8 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Estado de tu solicitud
          </h2>
          <StatusTimeline
            current={app.status as ApplicationStatus}
            history={
              (history ?? []) as {
                status: ApplicationStatus;
                created_at: string;
              }[]
            }
          />
        </div>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-3">
      <dt className="text-cyw-white/40">{k}</dt>
      <dd className="text-right text-cyw-white/80">{v}</dd>
    </div>
  );
}
