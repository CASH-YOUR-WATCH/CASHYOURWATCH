import type { ComponentProps } from "react";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`w-full border border-cyw-white/20 bg-transparent px-4 py-3 text-sm text-cyw-white transition-colors placeholder:text-cyw-white/30 focus:border-cyw-white/60 focus:outline-none ${className}`}
      {...props}
    />
  );
}
