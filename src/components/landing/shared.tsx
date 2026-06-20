import type { ReactNode } from "react";
import Image from "next/image";

/** Foto optimizada (next/image) dentro de un marco con relación de aspecto. */
export function Photo({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden border border-cyw-white/10 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Título de sección al estilo del mockup: serif en MAYÚSCULAS con un subrayado
 * corto debajo. Ej: "¿QUIÉNES SOMOS?" ──
 */
export function SectionTitle({
  children,
  tone = "dark",
  align = "left",
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  const isDark = tone === "dark";
  const color = isDark ? "text-cyw-white" : "text-cyw-black";
  const rule = isDark ? "bg-cyw-white/40" : "bg-cyw-black/40";

  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <h2
        className={`font-serif text-2xl uppercase leading-tight tracking-[0.08em] sm:text-3xl ${color}`}
      >
        {children}
      </h2>
      <span
        className={`mt-4 block h-px w-14 ${rule} ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}

/**
 * Marco de imagen elegante con el monograma CYW. Placeholder hasta que el
 * cliente entregue la fotografía real; basta reemplazarlo por <Image>.
 */
export function ImagePlaceholder({
  label,
  className = "",
  tone = "dark",
}: {
  label?: string;
  className?: string;
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  return (
    <div
      className={`relative overflow-hidden ${isDark ? "border border-cyw-white/10" : "border border-cyw-black/10"} ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-cyw-white/[0.08] via-cyw-white/[0.02] to-transparent"
            : "bg-gradient-to-br from-cyw-black/[0.07] via-cyw-black/[0.02] to-transparent"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-serif text-5xl ${isDark ? "text-cyw-white/[0.08]" : "text-cyw-black/[0.07]"}`}
        >
          CYW
        </span>
      </div>
      {label && (
        <span
          className={`absolute bottom-3 left-4 text-[9px] uppercase tracking-[0.25em] ${isDark ? "text-cyw-white/30" : "text-cyw-black/30"}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
