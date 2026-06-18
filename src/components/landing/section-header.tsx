import type { ReactNode } from "react";

/**
 * Encabezado editorial: índice + hairline + eyebrow, y título serif grande.
 *   01 ———————————————— ¿QUIÉNES SOMOS?
 *   Título grande en serif
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  tone = "dark",
  className = "",
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  const isDark = tone === "dark";
  const muted = isDark ? "text-cyw-white/40" : "text-cyw-black/40";
  const strong = isDark ? "text-cyw-white" : "text-cyw-black";
  const rule = isDark ? "bg-cyw-white/15" : "bg-cyw-black/15";

  return (
    <div className={className}>
      <div className="flex items-center gap-5">
        <span className={`font-serif text-sm ${muted}`}>{index}</span>
        <span className={`h-px flex-1 ${rule}`} />
        <span className={`text-[11px] uppercase tracking-[0.3em] ${muted}`}>
          {eyebrow}
        </span>
      </div>
      <h2
        className={`mt-7 font-serif text-4xl leading-[1.05] sm:text-5xl ${strong}`}
      >
        {title}
      </h2>
    </div>
  );
}
