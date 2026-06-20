import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, ImagePlaceholder } from "./shared";
import { Reveal } from "./reveal";

export function SectionCtaFinal() {
  return (
    <section className="border-t border-cyw-white/10 py-24 sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <ImagePlaceholder label="Caja CYW" className="aspect-[4/3] w-full" />
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
