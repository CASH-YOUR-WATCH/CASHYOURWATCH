import { Container } from "./shared";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";
import { Faq } from "./faq";

export function SectionFaq() {
  return (
    <section id="faq" className="bg-cyw-white py-28 text-cyw-black sm:py-40">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionHeader
              index="05"
              eyebrow="FAQ"
              tone="light"
              title="Preguntas frecuentes"
            />
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-cyw-black/55">
              Acompañamiento experto en cada etapa. Así protegemos, evaluamos y
              convertimos tus activos en nuevas oportunidades.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={0.1}>
            <Faq />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
