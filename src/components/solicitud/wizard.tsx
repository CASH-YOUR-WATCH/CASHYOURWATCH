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
  ACCESSORY_ITEMS,
  PROOF_TYPE,
  FILE_TYPE_LABELS,
  type WatchCondition,
  type FileType,
  type AccessoryItemKey,
} from "@/lib/applications";
import { FileField, Thumb } from "./file-field";

const TOTAL = 6;
const STEP_TITLES = [
  "Solicitante",
  "El reloj",
  "Accesorios",
  "Fotografías",
  "Documentos",
  "Confirmación",
];
const STEP_IMAGES = [
  "/images/cliente.png",
  "/images/quienes-somos.png",
  "/images/caja-reloj.png",
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

/** Hora aleatoria (formato reloj H:MM) para la prueba de existencia. */
function randomWatchTime(): string {
  const h = 1 + Math.floor(Math.random() * 12); // 1–12
  const m = Math.floor(Math.random() * 60); // 0–59
  return `${h}:${String(m).padStart(2, "0")}`;
}

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
  const [referencia, setReferencia] = useState("");
  const [anio, setAnio] = useState("");
  const [diametro, setDiametro] = useState("");
  const [atributos, setAtributos] = useState("");
  const [estado, setEstado] = useState<WatchCondition | "">("");
  const [valor, setValor] = useState("");
  const [monto, setMonto] = useState("");
  const [manifiesto, setManifiesto] = useState(false);
  const [pruebaHora] = useState(randomWatchTime);
  const [fullSet, setFullSet] = useState<boolean | null>(null);
  const [accesorios, setAccesorios] = useState<
    Record<AccessoryItemKey, boolean>
  >({
    tiene_caja: false,
    tiene_papeles: false,
    tiene_ajustadores: false,
  });
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
        manifiesto &&
        marca.trim() !== "" &&
        modelo.trim() !== "" &&
        referencia.trim() !== "" &&
        estado !== "" &&
        monto.trim() !== ""
      );
    if (step === 3) return fullSet !== null; // debe responder si es full set
    if (step === 4)
      return Boolean(files.foto_frontal) && Boolean(files[PROOF_TYPE]);
    if (step === 5) return true; // documentos: opcional
    if (step === 6) return acepta;
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
          numero_referencia: referencia.trim() || null,
          anio_fabricacion: anio ? Number(anio) : null,
          diametro_mm: diametro ? Number(diametro) : null,
          atributos_extra: atributos.trim() || null,
          estado_reloj: estado as WatchCondition,
          valor_estimado: valor ? Number(valor) : null,
          monto_deseado: monto ? Number(monto) : null,
          declaracion_licitud: manifiesto,
          prueba_hora: pruebaHora,
          full_set: fullSet === true,
          tiene_caja: fullSet === true ? true : accesorios.tiene_caja,
          tiene_papeles: fullSet === true ? true : accesorios.tiene_papeles,
          tiene_ajustadores:
            fullSet === true ? true : accesorios.tiene_ajustadores,
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
                {/* Declaración de procedencia lícita (manifiesto) */}
                <div className="rounded-lg border border-cyw-black/15 bg-cyw-black/[0.03] p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyw-black/50">
                    Declaración de procedencia lícita
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-cyw-black/60">
                    Para proteger a todas las partes y la transparencia del
                    proceso, manifiesto bajo protesta de decir verdad que soy el
                    propietario legítimo del reloj —o cuento con autorización para
                    disponer de él— y que su procedencia es lícita. Autorizo a
                    Cash Your Watch a realizar las verificaciones de debida
                    diligencia que considere necesarias, incluida la consulta en
                    registros y listas internacionales de piezas reportadas como
                    extraviadas o robadas. Entiendo que, de detectarse una
                    incidencia, Cash Your Watch podrá suspender el trámite y,
                    cuando la ley lo requiera, informar a las autoridades
                    competentes.
                  </p>
                  <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-cyw-black/70">
                    <input
                      type="checkbox"
                      checked={manifiesto}
                      onChange={(e) => setManifiesto(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      He leído y acepto la declaración de procedencia lícita.
                    </span>
                  </label>
                </div>

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
                      placeholder="Submariner, Nautilus…"
                    />
                  </LField>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <LField label="Número de referencia" htmlFor="referencia">
                    <input
                      id="referencia"
                      className={inputCls}
                      value={referencia}
                      onChange={(e) => setReferencia(e.target.value)}
                      placeholder="Ej. 126610LN"
                    />
                    <span className="block text-[11px] leading-relaxed text-cyw-black/40">
                      Suele venir en la tarjeta de garantía o grabado en la caja.
                    </span>
                  </LField>
                  <LField label="Año de fabricación (opcional)" htmlFor="anio">
                    <input
                      id="anio"
                      type="number"
                      min="1900"
                      max="2100"
                      className={inputCls}
                      value={anio}
                      onChange={(e) => setAnio(e.target.value)}
                      placeholder="Ej. 2019"
                    />
                  </LField>
                  <LField label="Diámetro de la caja (mm)" htmlFor="diametro">
                    <input
                      id="diametro"
                      type="number"
                      min="10"
                      max="80"
                      className={inputCls}
                      value={diametro}
                      onChange={(e) => setDiametro(e.target.value)}
                      placeholder="Ej. 40"
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

                <LField
                  label="Otros atributos (opcional)"
                  htmlFor="atributos"
                >
                  <textarea
                    id="atributos"
                    rows={3}
                    className={`${inputCls} resize-none`}
                    value={atributos}
                    onChange={(e) => setAtributos(e.target.value)}
                    placeholder="Material (oro, acero, platino), complicaciones, edición especial, o cualquier detalle que aumente su valor…"
                  />
                </LField>

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
              <div className="space-y-5">
                <p className="text-sm text-cyw-black/55">
                  Un set más completo suma valor a tu solicitud.
                </p>

                {/* Pregunta gatillo: ¿full set? */}
                <div className="rounded-lg border border-cyw-black/15 bg-cyw-black/[0.02] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-cyw-black/80">
                      ¿Tu reloj es <strong>full set</strong>? (viene completo,
                      con todo como se compró originalmente)
                    </span>
                    <div className="flex shrink-0 gap-2">
                      {([
                        ["Sí", true],
                        ["No", false],
                      ] as const).map(([lbl, val]) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setFullSet(val)}
                          className={`rounded-md border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
                            fullSet === val
                              ? "border-cyw-black bg-cyw-black text-cyw-white"
                              : "border-cyw-black/20 text-cyw-black/55 hover:border-cyw-black/45"
                          }`}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full set = sí → foto de cada elemento */}
                {fullSet === true && (
                  <div className="space-y-3">
                    <p className="text-sm text-cyw-black/55">
                      Perfecto. Sube una foto de cada elemento para respaldar el
                      set completo (recomendado):
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {ACCESSORY_ITEMS.map((acc) => (
                        <FileField
                          key={acc.key}
                          label={FILE_TYPE_LABELS[acc.evidencia]}
                          hint="Foto (opcional)"
                          file={files[acc.evidencia] ?? null}
                          accept={IMAGE_ACCEPT}
                          onChange={(f) => setFile(acc.evidencia, f)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Full set = no → preguntas individuales */}
                {fullSet === false && (
                  <div className="space-y-3">
                    <p className="text-sm text-cyw-black/55">
                      Indícanos qué incluye tu reloj:
                    </p>
                    {ACCESSORY_ITEMS.map((acc) => {
                      const on = accesorios[acc.key];
                      return (
                        <div
                          key={acc.key}
                          className="rounded-lg border border-cyw-black/12 p-4"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-cyw-black/80">
                              {acc.pregunta}
                            </span>
                            <div className="flex shrink-0 gap-2">
                              {([
                                ["Sí", true],
                                ["No", false],
                              ] as const).map(([lbl, val]) => (
                                <button
                                  key={lbl}
                                  type="button"
                                  onClick={() => {
                                    setAccesorios((p) => ({
                                      ...p,
                                      [acc.key]: val,
                                    }));
                                    if (!val) setFile(acc.evidencia, null);
                                  }}
                                  className={`rounded-md border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
                                    on === val
                                      ? "border-cyw-black bg-cyw-black text-cyw-white"
                                      : "border-cyw-black/20 text-cyw-black/55 hover:border-cyw-black/45"
                                  }`}
                                >
                                  {lbl}
                                </button>
                              ))}
                            </div>
                          </div>
                          {on && (
                            <div className="mt-4 max-w-[220px]">
                              <FileField
                                label={FILE_TYPE_LABELS[acc.evidencia]}
                                hint="Foto (opcional)"
                                file={files[acc.evidencia] ?? null}
                                accept={IMAGE_ACCEPT}
                                onChange={(f) => setFile(acc.evidencia, f)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <p className="text-sm text-cyw-black/55">
                  Sube fotografías claras. Se comprimen automáticamente.
                </p>

                {/* Prueba de existencia (obligatoria) */}
                <div className="rounded-lg border border-cyw-black/15 bg-cyw-black/[0.02] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyw-black/50">
                    Prueba de existencia · obligatoria
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-cyw-black/60">
                    Ajusta las manecillas de tu reloj para que marquen las{" "}
                    <strong className="text-cyw-black">{pruebaHora}</strong> y
                    tómale una foto junto a un papel con la{" "}
                    <strong>fecha de hoy</strong> y la palabra{" "}
                    <strong>“Cash Your Watch”</strong> escritas a mano. Con esto
                    confirmamos que tienes el reloj físicamente.
                  </p>
                  <p className="mt-2 rounded-md bg-cyw-black/[0.04] px-3 py-2 text-center font-serif text-2xl tracking-wide text-cyw-black">
                    {pruebaHora}
                  </p>
                  <div className="mt-3 max-w-[220px]">
                    <FileField
                      label={FILE_TYPE_LABELS[PROOF_TYPE]}
                      hint="Obligatoria"
                      file={files[PROOF_TYPE] ?? null}
                      accept={IMAGE_ACCEPT}
                      onChange={(f) => setFile(PROOF_TYPE, f)}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm text-cyw-black/55">
                    Fotos del reloj (la <strong>frontal</strong> es obligatoria;
                    el resto agiliza la valuación).
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
              </div>
            )}

            {step === 5 && (
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

            {step === 6 && (
              <div className="space-y-7">
                <p className="text-sm text-cyw-black/55">
                  Revisa y envía tu solicitud.
                </p>

                <dl className="divide-y divide-cyw-black/10 border-y border-cyw-black/10 text-sm">
                  <Resumen k="Nombre" v={nombre} />
                  <Resumen k="Teléfono" v={telefono} />
                  <Resumen k="Reloj" v={`${marca} ${modelo}`.trim()} />
                  <Resumen k="Referencia" v={referencia} />
                  <Resumen k="Año" v={anio} />
                  <Resumen k="Diámetro" v={diametro ? `${diametro} mm` : ""} />
                  <Resumen
                    k="Estado"
                    v={estado ? WATCH_CONDITION_LABELS[estado] : "—"}
                  />
                  <Resumen
                    k="Incluye"
                    v={
                      fullSet === true
                        ? "Full set"
                        : fullSet === false
                          ? ACCESSORY_ITEMS.filter((a) => accesorios[a.key])
                              .map((a) => a.corto)
                              .join(", ") || "—"
                          : "—"
                    }
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
