"use client";

import { useEffect, useState } from "react";

/** Miniatura para el resumen (paso de confirmación). */
export function Thumb({ file, label }: { file: File; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const u = URL.createObjectURL(file);
      setUrl(u);
      return () => URL.revokeObjectURL(u);
    }
  }, [file]);

  return (
    <div className="relative aspect-square overflow-hidden border border-cyw-white/10 bg-cyw-white/[0.02]">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={label} className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-base">
          📄
        </span>
      )}
    </div>
  );
}

export function FileField({
  label,
  hint,
  file,
  accept,
  onChange,
}: {
  label: string;
  hint?: string;
  file: File | null;
  accept: string;
  onChange: (f: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  return (
    <label className="relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border border-dashed border-cyw-white/20 bg-cyw-white/[0.02] p-4 text-center transition-colors hover:border-cyw-white/40">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-cyw-black/75 py-1.5 text-[10px] uppercase tracking-wide text-cyw-white">
            {label} ✓
          </span>
        </>
      ) : file ? (
        <>
          <span className="text-base">📄</span>
          <span className="text-[11px] text-cyw-white/80">{label} ✓</span>
          <span className="max-w-full truncate text-[10px] text-cyw-white/40">
            {file.name}
          </span>
        </>
      ) : (
        <>
          <span className="text-lg text-cyw-white/30">+</span>
          <span className="text-[11px] uppercase tracking-wide text-cyw-white/60">
            {label}
          </span>
          {hint && <span className="text-[9px] text-cyw-white/30">{hint}</span>}
        </>
      )}
    </label>
  );
}
