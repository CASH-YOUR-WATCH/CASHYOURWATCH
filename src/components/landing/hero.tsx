"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";

// El 3D solo se carga en cliente y bajo demanda; nunca bloquea el render.
const WatchScene = dynamic(() => import("./watch-scene"), { ssr: false });

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-28"
    >
      {/* Fondo + capa reservada para el 3D (Fase 11) */}
      <div aria-hidden className="absolute inset-0">
        <div className="hero-bg absolute inset-0" />
        {/* Spotlight que sigue el cursor */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(440px circle at var(--mx, 72%) var(--my, 32%), rgba(185,205,235,0.10), transparent 60%)",
          }}
        />
        {/* Reloj 3D (desktop). Capa data-hero-3d reservada en Fase 3, ahora viva. */}
        <div
          data-hero-3d
          className="absolute inset-y-0 right-0 hidden w-[58%] lg:block"
        >
          <WatchScene />
        </div>

        {/* Anillos metálicos (móvil/tablet, y fallback ligero) — bisel del reloj. */}
        <div className="absolute right-[-38%] top-[4%] opacity-70 sm:right-[-24%] lg:hidden">
          <div className="cyw-ring h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem]" />
          <div
            className="cyw-ring absolute inset-6"
            style={{ animationDuration: "44s", animationDirection: "reverse" }}
          />
          <div
            className="cyw-ring absolute inset-16"
            style={{ animationDuration: "22s" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-cyw-black via-cyw-black/25 to-transparent" />
      </div>

      <Container className="relative">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <span className="h-px w-12 bg-cyw-white/40" />
            <span className="text-[11px] uppercase tracking-[0.35em] text-cyw-white/50">
              Cash Your Watch — Elite assets
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-8 font-serif text-6xl leading-[0.95] text-cyw-white sm:text-7xl lg:text-[5.5rem]"
          >
            Convierte{" "}
            <span className="italic font-light text-cyw-white/85">
              exclusividad
            </span>
            <br />
            en <span className="italic font-light">oportunidad.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-md text-base leading-relaxed text-cyw-white/55"
          >
            Liquidez inmediata mediante un proceso profesional, seguro y
            discreto, respaldado por relojes y activos de alto valor.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-11 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/registro">
              <Button>Solicitar evaluación</Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="outline">Cómo funciona</Button>
            </a>
          </motion.div>
        </motion.div>
      </Container>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-cyw-white/30">
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-cyw-white/40 to-transparent" />
      </div>
    </section>
  );
}
