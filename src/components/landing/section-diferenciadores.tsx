import { Container, ImagePlaceholder, SectionTitle } from "./shared";
import { Reveal } from "./reveal";

const ITEMS: { title: string; body: string }[] = [
  { title: "Atención discreta", body: "Privacidad y confianza en cada etapa." },
  {
    title: "Especialización en activos de lujo",
    body: "Conocimiento experto para valorar lo excepcional.",
  },
  {
    title: "Liquidez estratégica",
    body: "Capital inteligente cuando las oportunidades aparecen.",
  },
  {
    title: "Plataforma moderna",
    body: "Tecnología diseñada para una experiencia eficiente.",
  },
];

export function SectionDiferenciadores() {
  return (
    <section className="border-t border-cyw-white/10 py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <SectionTitle>Qué nos diferencia</SectionTitle>
          <p className="mt-8 max-w-sm leading-relaxed text-cyw-white/60">
            Cash Your Watch redefine la relación entre patrimonio y liquidez,
            convirtiendo activos de lujo en oportunidades financieras mediante
            una experiencia profesional, discreta y confiable.
          </p>
        </Reveal>

        <Reveal className="lg:col-span-4" delay={0.1}>
          <div className="space-y-8">
            {ITEMS.map((it) => (
              <div key={it.title}>
                <h3 className="font-serif text-lg italic text-cyw-white">
                  {it.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cyw-white/55">
                  {it.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-4" delay={0.2}>
          <ImagePlaceholder
            label="Reloj, pluma y documentos"
            className="aspect-[3/4] w-full"
          />
        </Reveal>
      </Container>
    </section>
  );
}
