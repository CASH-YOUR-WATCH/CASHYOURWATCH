"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { PACKAGING_ITEMS, FILE_TYPE_LABELS, type FileType } from "@/lib/applications";

type Slot = "idle" | "busy" | "done" | "error";

export function PackagingSubmit({
  applicationId,
  userId,
  existing,
}: {
  applicationId: string;
  userId: string;
  existing: string[];
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<Record<string, Slot>>(() =>
    Object.fromEntries(
      PACKAGING_ITEMS.map((it) => [
        it.tipo,
        existing.includes(it.tipo) ? "done" : "idle",
      ]),
    ),
  );

  async function upload(tipo: FileType, file: File | null) {
    if (!file) return;
    setSlots((s) => ({ ...s, [tipo]: "busy" }));
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
      const path = `${userId}/${applicationId}/${tipo}.jpg`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("application-files")
        .upload(path, compressed, {
          upsert: true,
          contentType: "image/jpeg",
        });
      if (upErr) throw upErr;

      if (!existing.includes(tipo)) {
        const { error: rowErr } = await supabase
          .from("application_files")
          .insert({ application_id: applicationId, tipo, storage_path: path });
        if (rowErr) throw rowErr;
        existing.push(tipo);
      }
      setSlots((s) => ({ ...s, [tipo]: "done" }));
      router.refresh();
    } catch {
      setSlots((s) => ({ ...s, [tipo]: "error" }));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {PACKAGING_ITEMS.map((it) => {
        const st = slots[it.tipo];
        return (
          <label
            key={it.tipo}
            className={`flex cursor-pointer flex-col gap-1.5 border border-dashed p-4 text-center transition-colors ${
              st === "done"
                ? "border-emerald-400/40 bg-emerald-400/[0.05]"
                : "border-cyw-white/20 hover:border-cyw-white/45"
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              disabled={st === "busy"}
              onChange={(e) => upload(it.tipo, e.target.files?.[0] ?? null)}
            />
            <span className="text-[11px] uppercase tracking-[0.15em] text-cyw-white/70">
              {FILE_TYPE_LABELS[it.tipo]}
              {st === "done" ? " ✓" : ""}
            </span>
            <span className="text-[10px] leading-relaxed text-cyw-white/40">
              {st === "busy"
                ? "Subiendo…"
                : st === "error"
                  ? "Error, reintenta"
                  : it.hint}
            </span>
          </label>
        );
      })}
    </div>
  );
}
