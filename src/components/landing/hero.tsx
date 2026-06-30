"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";
import { Particles } from "./particles";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden">
      {/* Foto de fondo (fachada/ciudad). */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyw-black via-cyw-black/55 to-cyw-black/25" />
        <Particles className="opacity-100" />
      </div>

      <Container className="relative pb-24 pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="max-w-4xl font-serif text-4xl uppercase leading-[1.08] tracking-[0.02em] text-cyw-white sm:text-5xl lg:text-6xl">
            Convierte exclusividad en oportunidad
          </h1>
          <p className="mt-7 max-w-lg leading-relaxed text-cyw-white/70">
            Accede a liquidez inmediata mediante un proceso profesional, seguro y
            discreto, respaldado por relojes y activos de alto valor.
          </p>
          <Link href="/registro" className="mt-9 inline-block">
            <Button>Solicitar evaluación</Button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
