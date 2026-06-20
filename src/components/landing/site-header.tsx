"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
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

  // Bloquea el scroll del fondo mientras el panel está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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
            <Link
              href="/login"
              className="text-xs uppercase tracking-[0.15em] text-cyw-white/60 transition-colors hover:text-cyw-white"
            >
              Iniciar sesión
            </Link>
            <Link href="/registro">
              <Button variant="outline" size="sm">
                Solicitar evaluación
              </Button>
            </Link>
          </nav>

          {/* Botón hamburguesa (móvil) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col gap-1.5 py-1 lg:hidden"
            aria-label="Abrir menú"
          >
            <span className="block h-px w-6 bg-cyw-white" />
            <span className="block h-px w-6 bg-cyw-white" />
            <span className="block h-px w-4 bg-cyw-white" />
          </button>
        </div>
      </header>

      {/* Menú pantalla completa (fuera del header para que el desenfoque funcione) */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex h-full w-full flex-col bg-cyw-black/60 px-8 py-7 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl tracking-tight text-cyw-white">
                CYW
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="text-3xl font-light leading-none text-cyw-white/70 transition-colors hover:text-cyw-white"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-8">
              {NAV.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.4 }}
                  className="font-serif text-4xl text-cyw-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-opacity hover:opacity-80"
                >
                  {n.label}
                </motion.a>
              ))}
            </nav>

            <div className="flex flex-col gap-4 border-t border-cyw-white/15 pt-7">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-xs uppercase tracking-[0.2em] text-cyw-white/70 transition-colors hover:text-cyw-white"
              >
                Iniciar sesión
              </Link>
              <Link href="/registro" onClick={() => setOpen(false)}>
                <Button className="w-full">Solicitar evaluación</Button>
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
