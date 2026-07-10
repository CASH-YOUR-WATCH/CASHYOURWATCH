"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { submitExistenceProof } from "@/lib/existence/actions";

export function ExistenceProofSubmit({
  proofId,
  applicationId,
  userId,
}: {
  proofId: string;
  applicationId: string;
  userId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
      });
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${userId}/${applicationId}/existence_${proofId}.${ext}`;

      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("application-files")
        .upload(path, compressed, {
          upsert: true,
          contentType: file.type || "image/jpeg",
        });
      if (upErr) throw upErr;

      const res = await submitExistenceProof(proofId, path);
      if (res.error) throw new Error(res.error);

      router.refresh();
    } catch {
      setError("No se pudo enviar la foto. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 border border-cyw-white bg-cyw-white px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-cyw-black transition-opacity hover:opacity-90">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="hidden"
          disabled={busy}
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
        {busy ? "Enviando…" : "Tomar / subir foto"}
      </label>
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
