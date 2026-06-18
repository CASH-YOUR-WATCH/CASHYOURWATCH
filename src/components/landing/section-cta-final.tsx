import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";
import { Reveal } from "./reveal";

export function SectionCtaFinal() {
  return (
    <section className="relative overflow-hidden border-t border-cyw-white/10 py-32 sm:py-44">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(185,205,235,0.09),transparent_60%)]" />
        <div className="cyw-ring absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      </div>

      <Container className="relative text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyw-white/40">
            Sin compromiso
          </p>
          <h2 className="mx-auto mt-7 max-w-4xl font-serif text-4xl leading-[1.08] text-cyw-white sm:text-6xl">
            El patrimonio debe generar{" "}
            <span className="font-light italic text-cyw-white/75">
              oportunidades
            </span>
            . No permanecer inmóvil.
          </h2>
          <p className="mx-auto mt-7 max-w-md leading-relaxed text-cyw-white/55">
            Solicita tu avalúo y recibe una oferta en menos de 24 horas.
          </p>
          <Link href="/registro" className="mt-11 inline-block">
            <Button>Solicitar evaluación</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
