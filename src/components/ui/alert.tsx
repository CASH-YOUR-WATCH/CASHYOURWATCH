import type { ReactNode } from "react";

const KINDS = {
  error: "border-red-500/30 bg-red-500/5 text-red-300",
  success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  info: "border-cyw-white/20 bg-cyw-white/5 text-cyw-white/70",
} as const;

export function Alert({
  kind = "error",
  children,
}: {
  kind?: keyof typeof KINDS;
  children: ReactNode;
}) {
  return (
    <div className={`border px-4 py-3 text-sm ${KINDS[kind]}`} role="status">
      {children}
    </div>
  );
}
