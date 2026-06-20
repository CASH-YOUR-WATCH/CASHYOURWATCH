import { Container, SectionTitle } from "./shared";
import { Reveal } from "./reveal";
import { Faq } from "./faq";

export function SectionFaq() {
  return (
    <section id="faq" className="bg-cyw-cream py-24 text-cyw-black sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionTitle tone="light">FAQ</SectionTitle>
          <p className="mt-8 max-w-xs font-serif text-sm uppercase leading-relaxed tracking-[0.05em] text-cyw-black/55">
            Acompañamiento experto en cada etapa. Conoce cómo protegemos,
            evaluamos y convertimos tus activos en nuevas oportunidades.
          </p>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={0.1}>
            <Faq />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
