"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FileField, Thumb } from "./file-field";

const TOTAL = 5;
const STEP_TITLES = [
  "Solicitante",
  "El reloj",
  "Fotografías",
  "Documentos",
  "Confirmación",
];

const CONDITION_DESC: Record<WatchCondition, string> = {
  excelente: "Como nuevo, sin marcas de uso.",
  bueno: "Uso ligero, bien conservado.",
  regular: "Marcas visibles de uso.",
};

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const DOC_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_FILE_MB = 10;

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

      // Dispara correos (usuario + admin) en el servidor. Best-effort.
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

  // --- Pantalla de éxito ----------------------------------------------------
  if (folio) {
    return (
      <section className="relative overflow-hidden py-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="cyw-ring absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-md text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyw-white/40">
            Solicitud enviada
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-cyw-white">
            Recibimos tu solicitud
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-cyw-white/60">
            Tu folio es{" "}
            <span className="font-serif text-lg text-cyw-white">#{folio}</span>.
            Nuestro equipo revisará la información y te contactará pronto. Podrás
            dar seguimiento al estado desde tu cuenta.
          </p>
          <Link href="/panel" className="mt-10 inline-block">
            <Button>Ver mis solicitudes</Button>
          </Link>
        </motion.div>
      </section>
    );
  }

  // --- Wizard ---------------------------------------------------------------
  return (
    <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[260px_1fr] lg:gap-20">
      {/* Stepper (desktop) */}
      <aside className="hidden lg:block">
        <div className="lg:sticky lg:top-28">
          <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Tu solicitud
          </p>
          <ol>
            {STEP_TITLES.map((t, i) => {
              const n = i + 1;
              const active = n === step;
              const done = n < step;
              return (
                <li key={t} className="flex items-center gap-4 py-2.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] transition-colors ${
                      active
                        ? "border-cyw-white bg-cyw-white text-cyw-black"
                        : done
                          ? "border-cyw-white/40 text-cyw-white/70"
                          : "border-cyw-white/15 text-cyw-white/30"
                    }`}
                  >
                    {done ? "✓" : String(n).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-xs uppercase tracking-[0.15em] transition-colors ${
                      active
                        ? "text-cyw-white"
                        : done
                          ? "text-cyw-white/60"
                          : "text-cyw-white/30"
                    }`}
                  >
                    {t}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      {/* Contenido */}
      <div className="min-w-0">
        {/* Progreso (móvil) */}
        <div className="mb-10 lg:hidden">
          <div className="flex items-end justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
              Paso {step} de {TOTAL}
            </p>
            <p className="font-serif text-lg text-cyw-white">
              {STEP_TITLES[step - 1]}
            </p>
          </div>
          <div className="mt-3 h-px w-full bg-cyw-white/10">
            <div
              className="h-px bg-cyw-white transition-all duration-500"
              style={{ width: `${(step / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        {/* Título del paso (desktop) */}
        <div className="mb-8 hidden lg:block">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Paso {step} de {TOTAL}
          </p>
          <h1 className="mt-2 font-serif text-3xl text-cyw-white">
            {STEP_TITLES[step - 1]}
          </h1>
        </div>

        {error && (
          <div className="mb-6">
            <Alert>{error}</Alert>
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
                <p className="text-sm text-cyw-white/50">
                  Confirma tus datos de contacto.
                </p>
                <Field label="Nombre completo" htmlFor="nombre">
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Field>
                <Field label="Teléfono" htmlFor="telefono">
                  <Input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Marca" htmlFor="marca">
                    <Input
                      id="marca"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      placeholder="Rolex, Patek Philippe…"
                    />
                  </Field>
                  <Field label="Modelo" htmlFor="modelo">
                    <Input
                      id="modelo"
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="space-y-3">
                  <span className="block text-[11px] uppercase tracking-[0.2em] text-cyw-white/50">
                    Estado general
                  </span>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {WATCH_CONDITIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEstado(c)}
                        className={`border p-4 text-left transition-colors ${
                          estado === c
                            ? "border-cyw-white bg-cyw-white/10"
                            : "border-cyw-white/15 hover:border-cyw-white/40"
                        }`}
                      >
                        <span className="block text-sm uppercase tracking-[0.1em] text-cyw-white">
                          {WATCH_CONDITION_LABELS[c]}
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-cyw-white/45">
                          {CONDITION_DESC[c]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Valor estimado (MXN, opcional)" htmlFor="valor">
                    <Input
                      id="valor"
                      type="number"
                      min="0"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                    />
                  </Field>
                  <Field label="Monto deseado (MXN)" htmlFor="monto">
                    <Input
                      id="monto"
                      type="number"
                      min="0"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-cyw-white/50">
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
                <p className="text-sm text-cyw-white/50">
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
                <p className="text-sm text-cyw-white/50">
                  Revisa y envía tu solicitud.
                </p>

                <dl className="divide-y divide-cyw-white/10 border-y border-cyw-white/10 text-sm">
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
                    <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-cyw-white/40">
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

                <label className="flex items-start gap-3 text-xs leading-relaxed text-cyw-white/60">
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
                      className="underline hover:text-cyw-white"
                    >
                      aviso de privacidad
                    </Link>{" "}
                    y los{" "}
                    <Link href="/terminos" className="underline hover:text-cyw-white">
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
        <div className="mt-12 flex items-center justify-between border-t border-cyw-white/10 pt-6">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1 || submitting}
          >
            Atrás
          </Button>

          {step < TOTAL ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!puedeAvanzar()}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!puedeAvanzar() || submitting}
            >
              {submitting ? "Enviando…" : "Enviar solicitud"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Resumen({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 py-3">
      <dt className="text-cyw-white/40">{k}</dt>
      <dd className="text-right text-cyw-white/80">{v || "—"}</dd>
    </div>
  );
}
