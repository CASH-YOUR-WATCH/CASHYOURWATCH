import { Container, ImagePlaceholder } from "./shared";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

export function SectionQuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="border-t border-cyw-white/10 py-28 sm:py-40"
    >
      <Container>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="¿Quiénes somos?"
            title={
              <>
                Convertimos{" "}
                <span className="font-light italic text-cyw-white/70">
                  patrimonio
                </span>{" "}
                en acceso.
              </>
            }
          />
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-20">
          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="font-serif text-2xl leading-snug text-cyw-white/80 sm:text-3xl">
              Una plataforma especializada en financiamiento respaldado por
              relojería y activos de lujo.
            </p>
            <p className="mt-7 max-w-xl leading-relaxed text-cyw-white/55">
              Creada para ofrecer acceso rápido, seguro y profesional a capital
              inmediato. Convertimos patrimonio en acceso, confianza en respaldo
              y valor en oportunidades.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.2}>
            <ImagePlaceholder
              label="Relojería de lujo"
              className="aspect-[3/4] w-full"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
