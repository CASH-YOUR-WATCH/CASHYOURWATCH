import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

/** Contenedor de páginas legales (conciso, on-brand). */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-cyw-white/10 px-6 py-5 sm:px-10">
        <Link href="/">
          <Logo className="origin-left scale-90" />
        </Link>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-20">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] text-cyw-white/50 transition-colors hover:text-cyw-white"
        >
          ← Inicio
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cyw-white">{title}</h1>
        {updated && (
          <p className="mt-2 text-xs text-cyw-white/40">
            Última actualización: {updated}
          </p>
        )}

        <div className="mt-10 space-y-8">{children}</div>
      </div>

      <footer className="border-t border-cyw-white/10 px-6 py-6 sm:px-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyw-white/30">
          © 2026 Cash Your Watch
        </p>
      </footer>
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-[0.2em] text-cyw-white/85">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-cyw-white/55">
        {children}
      </div>
    </section>
  );
}
