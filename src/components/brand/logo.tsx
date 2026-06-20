/**
 * Lockup de marca: monograma CYW + línea separadora + nombre + tagline.
 * tone="light" (default) para fondos oscuros; tone="dark" para fondos claros.
 */
export function Logo({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const main = tone === "light" ? "text-cyw-white" : "text-cyw-black";
  const rule = tone === "light" ? "bg-cyw-white/30" : "bg-cyw-black/30";
  const muted = tone === "light" ? "text-cyw-white/50" : "text-cyw-black/50";

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className={`font-serif text-4xl font-medium leading-none tracking-tight ${main}`}>
        CYW
      </span>
      <span aria-hidden className={`h-9 w-px ${rule}`} />
      <span className="flex flex-col">
        <span className={`font-serif text-lg leading-none tracking-[0.18em] ${main}`}>
          CASH YOUR WATCH
        </span>
        <span className={`mt-1.5 text-[8px] uppercase leading-none tracking-[0.32em] ${muted}`}>
          Elite assets. Immediate access.
        </span>
      </span>
    </div>
  );
}
