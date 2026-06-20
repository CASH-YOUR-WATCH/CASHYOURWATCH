"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { notifyApplicationSubmitted } from "@/lib/solicitud/actions";
import {
  WATCH_CONDITIONS,
  WATCH_CONDITION_LABELS,
  PHOTO_TYPES,
  DOCUMENT_TYPES,
  FILE_TYPE_LABELS,
  type WatchCondition,
  type FileType,
} from "@/lib/applications";
import { FileField, Thumb } from "./file-field";

const TOTAL = 5;
const STEP_TITLES = [
  "Solicitante",
  "El reloj",
  "Fotografías",
  "Documentos",
  "Confirmación",
];
const STEP_IMAGES = [
  "/images/cliente.png",
  "/images/quienes-somos.png",
  "/images/reloj-2.png",
  "/images/contrato.png",
  "/images/finanzas.png",
];

const CONDITION_DESC: Record<WatchCondition, string> = {
  excelente: "Como nuevo, sin marcas de uso.",
  bueno: "Uso ligero, bien conservado.",
  regular: "Marcas visibles de uso.",
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const DOC_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_FILE_MB = 10;

const inputCls =
  "w-full rounded-md border border-cyw-black/15 bg-white px-4 py-3 text-sm text-cyw-black placeholder:text-cyw-black/30 focus:border-cyw-black/50 focus:outline-none";

function LField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-[0.2em] text-cyw-black/50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function SolicitudWizard({
  initialNombre,
  initialTelefono,
}: {
  initialNombre: string;
  initialTelefono: string;
}) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState(initialNombre);
  const [telefono, setTelefono] = useState(initialTelefono);
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [estado, setEstado] = useState<WatchCondition | "">("");
  const [valor, setValor] = useState("");
  const [monto, setMonto] = useState("");
  const [files, setFiles] = useState<Partial<Record<FileType, File>>>({});
  const [acepta, setAcepta] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [folio, setFolio] = useState<string | null>(null);

  function setFile(tipo: FileType, f: File | null) {
    setError("");
    if (f && f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`El archivo "${f.name}" supera los ${MAX_FILE_MB} MB.`);
      return;
    }
    setFiles((prev) => {
      const next = { ...prev };
      if (f) next[tipo] = f;
      else delete next[tipo];
      return next;
    });
  }

  function puedeAvanzar(): boolean {
    if (step === 1) return nombre.trim() !== "" && telefono.trim() !== "";
    if (step === 2)
      return (
        marca.trim() !== "" &&
        modelo.trim() !== "" &&
        estado !== "" &&
        monto.trim() !== ""
      );
    if (step === 3) return Boolean(files.foto_frontal);
    if (step === 4) return true;
    if (step === 5) return acepta;
    return false;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      await supabase
        .from("profiles")
        .update({ nombre: nombre.trim(), telefono: telefono.trim() })
        .eq("id", user.id);

      const { data: app, error: appErr } = await supabase
        .from("applications")
        .insert({
          user_id: user.id,
          marca: marca.trim(),
          modelo: modelo.trim(),
          estado_reloj: estado as WatchCondition,
          valor_estimado: valor ? Number(valor) : null,
          monto_deseado: monto ? Number(monto) : null,
        })
        .select("id, folio")
        .single();

      if (appErr || !app) throw new Error(appErr?.message ?? "insert");

      for (const [tipo, file] of Object.entries(files) as [FileType, File][]) {
        let toUpload: Blob = file;
        if (file.type.startsWith("image/")) {
          toUpload = await imageCompression(file, {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 2000,
            useWebWorker: true,
          });
        }
        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `${user.id}/${app.id}/${tipo}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("application-files")
          .upload(path, toUpload, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;

        const { error: rowErr } = await supabase
          .from("application_files")
          .insert({ application_id: app.id, tipo, storage_path: path });
        if (rowErr) throw rowErr;
      }

      void notifyApplicationSubmitted(app.id);
      setFolio(app.folio);
    } catch {
      setError(
        "No se pudo enviar la solicitud. Revisa tu conexión e intenta de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // --- Pantalla de éxito (tema claro) ---------------------------------------
  if (folio) {
    return (
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-cyw-black/10 bg-white p-10 text-center shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.35em] text-cyw-black/40">
          Solicitud enviada
        </p>
        <h1 className="mt-5 font-serif text-3xl text-cyw-black">
          Recibimos tu solicitud
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-cyw-black/60">
          Tu folio es{" "}
          <span className="font-serif text-lg text-cyw-black">#{folio}</span>.
          Nuestro equipo revisará la información y te contactará pronto.
        </p>
        <Link
          href="/panel"
          className="mt-8 inline-block bg-cyw-black px-6 py-3 text-xs uppercase tracking-[0.2em] text-cyw-white transition-colors hover:bg-cyw-black/90"
        >
          Ver mis solicitudes
        </Link>
      </div>
    );
  }

  // --- Wizard ---------------------------------------------------------------
  return (
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-cyw-black/10 bg-white shadow-sm lg:grid-cols-[5fr_7fr]">
      {/* Panel de imagen (desktop) */}
      <aside className="relative hidden min-h-[660px] lg:block">
        {STEP_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="40vw"
            className={`object-cover transition-opacity duration-700 ${
              i === step - 1 ? "opacity-100" : "opacity-0"
            }`}
            priority={i === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-cyw-black/90 via-cyw-black/40 to-cyw-black/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-9 text-cyw-white">
          <span className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/70">
            Solicitud de evaluación
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/60">
              Paso {step} de {TOTAL}
            </p>
            <h2 className="mt-2 font-serif text-3xl uppercase tracking-[0.04em]">
              {STEP_TITLES[step - 1]}
            </h2>
            <div className="mt-6 h-px w-full bg-cyw-white/20">
              <div
                className="h-px bg-cyw-white transition-all duration-500"
                style={{ width: `${(step / TOTAL) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Formulario */}
      <div className="p-7 sm:p-12">
        {/* Progreso (móvil) */}
        <div className="mb-8 lg:hidden">
          <div className="flex items-end justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-black/40">
              Paso {step} de {TOTAL}
            </p>
            <p className="font-serif text-lg text-cyw-black">
              {STEP_TITLES[step - 1]}
            </p>
          </div>
          <div className="mt-3 h-px w-full bg-cyw-black/10">
            <div
              className="h-px bg-cyw-black transition-all duration-500"
              style={{ width: `${(step / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-cyw-black/55">
                  Confirma tus datos de contacto.
                </p>
                <LField label="Nombre completo" htmlFor="nombre">
                  <input
                    id="nombre"
                    className={inputCls}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </LField>
                <LField label="Teléfono" htmlFor="telefono">
                  <input
                    id="telefono"
                    type="tel"
                    className={inputCls}
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </LField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <LField label="Marca" htmlFor="marca">
                    <input
                      id="marca"
                      className={inputCls}
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      placeholder="Rolex, Patek Philippe…"
                    />
                  </LField>
                  <LField label="Modelo" htmlFor="modelo">
                    <input
                      id="modelo"
                      className={inputCls}
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                    />
                  </LField>
                </div>

                <div className="space-y-3">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-cyw-black/50">
                    Estado general
                  </span>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {WATCH_CONDITIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEstado(c)}
                        className={`rounded-lg border p-4 text-left transition-colors ${
                          estado === c
                            ? "border-cyw-black bg-cyw-black/[0.04]"
                            : "border-cyw-black/15 hover:border-cyw-black/40"
                        }`}
                      >
                        <span className="block text-sm uppercase tracking-[0.1em] text-cyw-black">
                          {WATCH_CONDITION_LABELS[c]}
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-cyw-black/50">
                          {CONDITION_DESC[c]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <LField label="Valor estimado (MXN, opcional)" htmlFor="valor">
                    <input
                      id="valor"
                      type="number"
                      min="0"
                      className={inputCls}
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                    />
                  </LField>
                  <LField label="Monto deseado (MXN)" htmlFor="monto">
                    <input
                      id="monto"
                      type="number"
                      min="0"
                      className={inputCls}
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                    />
                  </LField>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-cyw-black/55">
                  Sube fotografías claras. La frontal es obligatoria; el resto
                  agiliza la valuación. Se comprimen automáticamente.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PHOTO_TYPES.map((t) => (
                    <FileField
                      key={t}
                      label={FILE_TYPE_LABELS[t]}
                      file={files[t] ?? null}
                      accept={IMAGE_ACCEPT}
                      onChange={(f) => setFile(t, f)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-cyw-black/55">
                  Adjunta los documentos que tengas (opcional). Imágenes o PDF.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {DOCUMENT_TYPES.map((t) => (
                    <FileField
                      key={t}
                      label={FILE_TYPE_LABELS[t]}
                      hint="Imagen o PDF"
                      file={files[t] ?? null}
                      accept={DOC_ACCEPT}
                      onChange={(f) => setFile(t, f)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-7">
                <p className="text-sm text-cyw-black/55">
                  Revisa y envía tu solicitud.
                </p>

                <dl className="divide-y divide-cyw-black/10 border-y border-cyw-black/10 text-sm">
                  <Resumen k="Nombre" v={nombre} />
                  <Resumen k="Teléfono" v={telefono} />
                  <Resumen k="Reloj" v={`${marca} ${modelo}`.trim()} />
                  <Resumen
                    k="Estado"
                    v={estado ? WATCH_CONDITION_LABELS[estado] : "—"}
                  />
                  <Resumen k="Monto deseado" v={monto ? `$${monto} MXN` : "—"} />
                </dl>

                {Object.keys(files).length > 0 && (
                  <div>
                    <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-cyw-black/40">
                      Archivos ({Object.keys(files).length})
                    </p>
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                      {(Object.entries(files) as [FileType, File][]).map(
                        ([tipo, f]) => (
                          <Thumb key={tipo} file={f} label={FILE_TYPE_LABELS[tipo]} />
                        ),
                      )}
                    </div>
                  </div>
                )}

                <label className="flex items-start gap-3 text-xs leading-relaxed text-cyw-black/60">
                  <input
                    type="checkbox"
                    checked={acepta}
                    onChange={(e) => setAcepta(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Acepto el{" "}
                    <Link
                      href="/aviso-de-privacidad"
                      className="underline hover:text-cyw-black"
                    >
                      aviso de privacidad
                    </Link>{" "}
                    y los{" "}
                    <Link href="/terminos" className="underline hover:text-cyw-black">
                      términos y condiciones
                    </Link>
                    .
                  </span>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <div className="mt-10 flex items-center justify-between border-t border-cyw-black/10 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || submitting}
            className="text-xs uppercase tracking-[0.2em] text-cyw-black/50 transition-colors hover:text-cyw-black disabled:pointer-events-none disabled:opacity-40"
          >
            Atrás
          </button>

          {step < TOTAL ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!puedeAvanzar()}
              className="bg-cyw-black px-6 py-3 text-xs uppercase tracking-[0.2em] text-cyw-white transition-colors hover:bg-cyw-black/90 disabled:pointer-events-none disabled:opacity-40"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!puedeAvanzar() || submitting}
              className="bg-cyw-black px-6 py-3 text-xs uppercase tracking-[0.2em] text-cyw-white transition-colors hover:bg-cyw-black/90 disabled:pointer-events-none disabled:opacity-40"
            >
              {submitting ? "Enviando…" : "Enviar solicitud"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Resumen({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-3">
      <dt className="text-cyw-black/45">{k}</dt>
      <dd className="text-right text-cyw-black/80">{v || "—"}</dd>
    </div>
  );
}
