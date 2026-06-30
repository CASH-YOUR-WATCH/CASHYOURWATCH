import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/panel/status-badge";
import { StatusTimeline } from "@/components/panel/status-timeline";
import { StatusControl } from "@/components/admin/status-control";
import { AddNote } from "@/components/admin/add-note";
import { DueDiligenceControl } from "@/components/admin/due-diligence-control";
import { formatDate, formatMoney } from "@/lib/format";
import {
  WATCH_CONDITION_LABELS,
  FILE_TYPE_LABELS,
  PHOTO_TYPES,
  type ApplicationStatus,
  type WatchCondition,
  type DueDiligence,
  type FileType,
} from "@/lib/applications";

export const metadata: Metadata = { title: "Admin — Detalle" };

export default async function AdminDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: app } = await supabase
    .from("applications")
    .select(
      "id, folio, marca, modelo, numero_referencia, anio_fabricacion, estado_reloj, valor_estimado, monto_deseado, declaracion_licitud, due_diligence, status, created_at, user_id",
    )
    .eq("id", id)
    .maybeSingle();

  if (!app) notFound();

  const [{ data: profile }, { data: userRes }, { data: history }, { data: fileRows }, { data: notes }] =
    await Promise.all([
      supabase.from("profiles").select("nombre, telefono").eq("id", app.user_id).maybeSingle(),
      supabase.auth.admin.getUserById(app.user_id),
      supabase
        .from("application_status_history")
        .select("status, created_at")
        .eq("application_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("application_files")
        .select("tipo, storage_path")
        .eq("application_id", id),
      supabase
        .from("application_notes")
        .select("nota, created_at")
        .eq("application_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const email = userRes?.user?.email ?? "—";

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
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin"
        className="text-xs uppercase tracking-[0.2em] text-cyw-white/50 transition-colors hover:text-cyw-white"
      >
        ← Solicitudes
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-cyw-white/10 pb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Solicitud
          </p>
          <h1 className="mt-2 font-serif text-4xl text-cyw-white">#{app.folio}</h1>
          <p className="mt-1 text-xs text-cyw-white/40">
            Recibida el {formatDate(app.created_at)}
          </p>
        </div>
        <StatusBadge status={app.status as ApplicationStatus} />
      </div>

      <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* Columna izquierda: solicitante + reloj + archivos */}
        <div className="space-y-10">
          <Bloque titulo="Solicitante">
            <dl className="divide-y divide-cyw-white/10 border-y border-cyw-white/10 text-sm">
              <Dato k="Nombre" v={profile?.nombre ?? "—"} />
              <Dato k="Teléfono" v={profile?.telefono ?? "—"} />
              <Dato k="Correo" v={email} />
            </dl>
          </Bloque>

          <Bloque titulo="El reloj">
            <dl className="divide-y divide-cyw-white/10 border-y border-cyw-white/10 text-sm">
              <Dato k="Marca" v={app.marca} />
              <Dato k="Modelo" v={app.modelo} />
              <Dato k="Referencia" v={app.numero_referencia || "—"} />
              <Dato
                k="Año"
                v={app.anio_fabricacion ? String(app.anio_fabricacion) : "—"}
              />
              <Dato
                k="Estado"
                v={WATCH_CONDITION_LABELS[app.estado_reloj as WatchCondition]}
              />
              <Dato k="Valor estimado" v={formatMoney(app.valor_estimado)} />
              <Dato k="Monto deseado" v={formatMoney(app.monto_deseado)} />
              <Dato
                k="Declaración de licitud"
                v={app.declaracion_licitud ? "Aceptada ✓" : "No registrada"}
              />
            </dl>
          </Bloque>

          {fotos.length > 0 && (
            <Bloque titulo="Fotografías">
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
            </Bloque>
          )}

          {docs.length > 0 && (
            <Bloque titulo="Documentos">
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
            </Bloque>
          )}
        </div>

        {/* Columna derecha: estado + timeline + notas */}
        <div className="space-y-10">
          <Bloque titulo="Cambiar estado">
            <StatusControl
              applicationId={app.id}
              current={app.status as ApplicationStatus}
            />
            <div className="mt-8">
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
          </Bloque>

          <Bloque titulo="Debida diligencia — procedencia">
            <DueDiligenceControl
              applicationId={app.id}
              current={app.due_diligence as DueDiligence}
              marca={app.marca}
              modelo={app.modelo}
              referencia={app.numero_referencia}
            />
          </Bloque>

          <Bloque titulo="Notas internas">
            <AddNote applicationId={app.id} />
            <ul className="mt-6 space-y-4">
              {(notes ?? []).length === 0 && (
                <li className="text-sm text-cyw-white/35">Aún no hay notas.</li>
              )}
              {(notes ?? []).map((n, i) => (
                <li
                  key={i}
                  className="border-l border-cyw-white/15 pl-4 text-sm text-cyw-white/75"
                >
                  <p className="leading-relaxed">{n.nota}</p>
                  <p className="mt-1 text-[11px] text-cyw-white/35">
                    {formatDate(n.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          </Bloque>
        </div>
      </div>
    </div>
  );
}

function Bloque({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
        {titulo}
      </h2>
      {children}
    </section>
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
