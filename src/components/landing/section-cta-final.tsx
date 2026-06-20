import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, Photo } from "./shared";
import { Reveal } from "./reveal";
import { Particles } from "./particles";

export function SectionCtaFinal() {
  return (
    <section className="relative overflow-hidden border-t border-cyw-white/10 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0">
        <Particles className="opacity-40" />
        <div className="cyw-ring absolute right-[6%] top-1/2 hidden h-[24rem] w-[24rem] -translate-y-1/2 opacity-25 lg:block" />
      </div>
      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Photo
            src="/images/caja-reloj.png"
            alt="Caja Cash Your Watch"
            className="aspect-[4/3] w-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-serif text-2xl uppercase leading-snug tracking-[0.04em] text-cyw-white sm:text-4xl">
            Creemos que el patrimonio debe generar oportunidades. No permanecer
            inmóvil.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-cyw-white/60">
            Solicita tu avalúo sin compromiso y recibe una oferta en menos de 24
            horas.
          </p>
          <Link href="/registro" className="mt-9 inline-block">
            <Button>Solicitar evaluación</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
