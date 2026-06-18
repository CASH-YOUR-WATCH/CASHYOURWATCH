import type { ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-[11px] uppercase tracking-[0.2em] text-cyw-white/50"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
