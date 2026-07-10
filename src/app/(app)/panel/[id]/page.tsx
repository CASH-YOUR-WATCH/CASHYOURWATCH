import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/panel/status-badge";
import { StatusTimeline } from "@/components/panel/status-timeline";
import { ExistenceProofSubmit } from "@/components/panel/existence-proof-submit";
import { CounterofferResponse } from "@/components/panel/counteroffer-response";
import { PackagingSubmit } from "@/components/panel/packaging-submit";
import { formatDate, formatMoney } from "@/lib/format";
import { proofState, type ExistenceProof } from "@/lib/existence";
import {
  LOGISTICS_LABELS,
  LOGISTICS_DESC,
  COSTOS_AVISO,
  EMPAQUE_AVISO,
  type ContraofertaStatus,
  type LogisticsStage,
} from "@/lib/logistics";
import {
  WATCH_CONDITION_LABELS,
  FILE_TYPE_LABELS,
  PHOTO_TYPES,
  PACKAGING_TYPES,
  type ApplicationStatus,
  type WatchCondition,
  type FileType,
} from "@/lib/applications";

export const metadata: Metadata = { title: "Detalle de solicitud" };

const PROOF_DOT: Record<string, string> = {
  abierta: "bg-amber-400",
  programada: "bg-cyw-white/40",
  vencida: "bg-red-400",
  enviada: "bg-emerald-400",
  enviada_tarde: "bg-amber-400",
};

const LOGI_DOT: Record<string, string> = {
  guia_generada: "bg-cyw-white/50",
  en_transito: "bg-sky-400",
  recibido: "bg-sky-400",
  inspeccion: "bg-amber-400",
  aprobado: "bg-emerald-400",
  rechazado: "bg-red-400",
  devuelto: "bg-red-400",
};

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
      "id, folio, marca, modelo, estado_reloj, valor_estimado, monto_deseado, status, created_at, monto_contraoferta, contraoferta_status, guia_paqueteria, guia_tracking, guia_storage_path, monto_asegurado",
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
        isPackaging: (PACKAGING_TYPES as readonly string[]).includes(f.tipo),
      };
    }),
  );
  const fotos = files.filter((f) => f.isPhoto && f.url);
  const empaques = files.filter((f) => f.isPackaging && f.url);
  const docs = files.filter((f) => !f.isPhoto && !f.isPackaging && f.url);
  const empaquesSubidos = (fileRows ?? [])
    .map((f) => f.tipo)
    .filter((t) => (PACKAGING_TYPES as readonly string[]).includes(t));

  // Pruebas de existencia solicitadas por el equipo.
  const { data: proofRows } = await supabase
    .from("existence_proofs")
    .select(
      "id, window_start, window_end, instrucciones, storage_path, responded_at, created_at",
    )
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  const now = Date.now();
  const proofs = await Promise.all(
    ((proofRows ?? []) as ExistenceProof[]).map(async (p) => {
      let url: string | null = null;
      if (p.storage_path) {
        const { data } = await supabase.storage
          .from("application-files")
          .createSignedUrl(p.storage_path, 600);
        url = data?.signedUrl ?? null;
      }
      return { ...p, estado: proofState(p, now), url };
    }),
  );
  const proofAbierta = proofs.find((p) => p.estado.puedeResponder);

  // Logística de envío.
  const { data: eventRows } = await supabase
    .from("logistics_events")
    .select("etapa, nota, created_at")
    .eq("application_id", id)
    .order("created_at", { ascending: true });
  const logistics = (eventRows ?? []) as {
    etapa: string;
    nota: string | null;
    created_at: string;
  }[];

  let guiaUrl: string | null = null;
  if (app.guia_storage_path) {
    const { data } = await supabase.storage
      .from("application-files")
      .createSignedUrl(app.guia_storage_path, 600);
    guiaUrl = data?.signedUrl ?? null;
  }

  const contraoferta = app.contraoferta_status as ContraofertaStatus;

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

      {proofAbierta && (
        <div className="mt-8 border border-amber-400/30 bg-amber-400/[0.06] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-amber-300/90">
            Acción requerida — prueba de existencia
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cyw-white/80">
            Para continuar con tu evaluación necesitamos que subas una foto de tu
            reloj <strong className="text-cyw-white">ahora</strong>.
            {proofAbierta.instrucciones
              ? ` ${proofAbierta.instrucciones}`
              : ""}
          </p>
          <p className="mt-1.5 text-xs text-cyw-white/45">
            Ventana para responder: {formatDate(proofAbierta.window_start)} —{" "}
            {formatDate(proofAbierta.window_end)}
          </p>
          <div className="mt-4">
            <ExistenceProofSubmit
              proofId={proofAbierta.id}
              applicationId={app.id}
              userId={user.id}
            />
          </div>
        </div>
      )}

      {contraoferta !== "ninguna" && (
        <div className="mt-8 border border-cyw-white/15 bg-cyw-white/[0.02] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyw-white/45">
            Contraoferta
          </p>
          {contraoferta === "pendiente" ? (
            <>
              <p className="mt-2 text-sm text-cyw-white/80">
                Podemos ofrecerte{" "}
                <strong className="font-serif text-xl text-cyw-white">
                  {formatMoney(app.monto_contraoferta)}
                </strong>{" "}
                por tu reloj.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-cyw-white/50">
                {COSTOS_AVISO}
              </p>
              <div className="mt-4">
                <CounterofferResponse applicationId={app.id} />
              </div>
            </>
          ) : contraoferta === "aceptada" ? (
            <p className="mt-2 text-sm text-emerald-300/90">
              Aceptaste la contraoferta de {formatMoney(app.monto_contraoferta)}.
              Sigue las instrucciones de envío más abajo.
            </p>
          ) : (
            <p className="mt-2 text-sm text-cyw-white/60">
              Rechazaste la contraoferta de {formatMoney(app.monto_contraoferta)}.
            </p>
          )}
        </div>
      )}

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

          {proofs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
                Pruebas de existencia
              </h2>
              <ul className="space-y-5">
                {proofs.map((p) => (
                  <li key={p.id} className="border-l border-cyw-white/15 pl-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          PROOF_DOT[p.estado.key] ?? "bg-cyw-white/40"
                        }`}
                      />
                      <span className="text-sm text-cyw-white/80">
                        {p.estado.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-cyw-white/40">
                      {formatDate(p.window_start)} — {formatDate(p.window_end)}
                    </p>
                    {p.instrucciones && (
                      <p className="mt-1 text-xs leading-relaxed text-cyw-white/55">
                        {p.instrucciones}
                      </p>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block h-16 w-16 overflow-hidden border border-cyw-white/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.url}
                          alt="Prueba de existencia"
                          className="h-full w-full object-cover"
                        />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(contraoferta === "aceptada" ||
            app.guia_paqueteria ||
            empaques.length > 0) && (
            <div className="mt-12">
              <h2 className="mb-4 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
                Protocolo de empaque
              </h2>
              <p className="mb-5 text-xs leading-relaxed text-cyw-white/50">
                {EMPAQUE_AVISO}
              </p>
              <PackagingSubmit
                applicationId={app.id}
                userId={user.id}
                existing={empaquesSubidos}
              />
            </div>
          )}

          {(app.guia_paqueteria || logistics.length > 0) && (
            <div className="mt-12">
              <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
                Envío del reloj
              </h2>
              {app.guia_paqueteria && (
                <div className="mb-6 space-y-1.5 border border-cyw-white/10 p-4 text-sm">
                  <p className="text-cyw-white/60">
                    Paquetería:{" "}
                    <span className="text-cyw-white/90">
                      {app.guia_paqueteria}
                    </span>
                  </p>
                  <p className="text-cyw-white/60">
                    Rastreo:{" "}
                    <span className="text-cyw-white/90">{app.guia_tracking}</span>
                  </p>
                  {app.monto_asegurado != null && (
                    <p className="text-xs text-cyw-white/50">
                      Envío asegurado por {formatMoney(app.monto_asegurado)}.
                    </p>
                  )}
                  {guiaUrl && (
                    <a
                      href={guiaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block pt-1 text-sm text-cyw-white/80 underline-offset-4 hover:text-cyw-white hover:underline"
                    >
                      Descargar guía ↗
                    </a>
                  )}
                </div>
              )}
              {logistics.length > 0 && (
                <ul className="space-y-5">
                  {logistics.map((e, i) => (
                    <li key={i} className="border-l border-cyw-white/15 pl-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            LOGI_DOT[e.etapa] ?? "bg-cyw-white/40"
                          }`}
                        />
                        <span className="text-sm text-cyw-white/80">
                          {LOGISTICS_LABELS[e.etapa as LogisticsStage] ?? e.etapa}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-cyw-white/55">
                        {e.nota ??
                          LOGISTICS_DESC[e.etapa as LogisticsStage] ??
                          ""}
                      </p>
                      <p className="mt-1 text-[11px] text-cyw-white/40">
                        {formatDate(e.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
