/**
 * Lockup de marca: monograma CYW + línea separadora + nombre + tagline.
 * Reutilizable en nav, footer y placeholders. Por defecto se ve sobre fondo
 * oscuro (texto claro).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-serif text-4xl font-medium leading-none tracking-tight text-cyw-white">
        CYW
      </span>
      <span aria-hidden className="h-9 w-px bg-cyw-white/30" />
      <span className="flex flex-col">
        <span className="font-serif text-lg leading-none tracking-[0.18em] text-cyw-white">
          CASH YOUR WATCH
        </span>
        <span className="mt-1.5 text-[8px] uppercase leading-none tracking-[0.32em] text-cyw-white/50">
          Elite assets. Immediate access.
        </span>
      </span>
    </div>
  );
}
