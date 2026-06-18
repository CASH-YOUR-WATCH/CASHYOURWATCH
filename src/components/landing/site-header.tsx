"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#quienes-somos", label: "¿Quiénes somos?" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cyw-white/10 bg-cyw-black/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link href="/" aria-label="Cash Your Watch — inicio">
          <Logo className="origin-left scale-90" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-xs uppercase tracking-[0.15em] text-cyw-white/60 transition-colors hover:text-cyw-white"
            >
              {n.label}
            </a>
          ))}
          <Link href="/registro">
            <Button variant="outline" size="sm">
              Solicitar evaluación
            </Button>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-cyw-white lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-cyw-white/10 bg-cyw-black px-6 py-6 lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block text-sm uppercase tracking-[0.15em] text-cyw-white/70"
            >
              {n.label}
            </a>
          ))}
          <Link href="/registro" onClick={() => setOpen(false)} className="block pt-2">
            <Button className="w-full">Solicitar evaluación</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
