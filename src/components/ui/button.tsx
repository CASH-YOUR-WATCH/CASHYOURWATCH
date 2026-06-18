import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "dark" | "ghost";
type Size = "md" | "sm";

const VARIANTS: Record<Variant, string> = {
  // Botón claro: ideal sobre fondos oscuros.
  primary: "bg-cyw-white text-cyw-black hover:bg-cyw-white/90",
  // Borde: sobre fondos oscuros.
  outline: "border border-cyw-white/30 text-cyw-white hover:bg-cyw-white/10",
  // Botón oscuro: ideal sobre fondos claros (secciones blancas).
  dark: "bg-cyw-black text-cyw-white hover:bg-cyw-black/90",
  ghost: "text-cyw-white/70 hover:text-cyw-white",
};

const SIZES: Record<Size, string> = {
  md: "px-6 py-3 text-xs",
  sm: "px-5 py-2.5 text-[11px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={`inline-flex items-center justify-center uppercase tracking-[0.2em] transition-colors disabled:pointer-events-none disabled:opacity-50 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
