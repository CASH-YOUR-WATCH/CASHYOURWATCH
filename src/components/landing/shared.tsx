import type { ReactNode } from "react";

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

export function Eyebrow({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.3em] ${className}`}>
      {children}
    </p>
  );
}

/**
 * Marco de imagen elegante con el monograma CYW de fondo. Placeholder hasta que
 * el cliente entregue la fotografía real; basta con reemplazarlo por <Image>.
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
          className={`font-serif text-6xl ${isDark ? "text-cyw-white/[0.08]" : "text-cyw-black/[0.07]"}`}
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
