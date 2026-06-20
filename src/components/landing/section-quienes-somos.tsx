import { Container, Photo, SectionTitle } from "./shared";
import { Reveal } from "./reveal";

export function SectionQuienesSomos() {
  return (
    <section id="quienes-somos" className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <Reveal>
          <SectionTitle>¿Quiénes somos?</SectionTitle>
          <div className="mt-8 max-w-xl space-y-5 leading-relaxed text-cyw-white/60">
            <p>
              <span className="font-medium text-cyw-white/90">
                Cash Your Watch
              </span>{" "}
              es una plataforma especializada en financiamiento respaldado por
              relojería y activos de lujo, creada para ofrecer acceso rápido,
              seguro y profesional a capital inmediato.
            </p>
            <p>
              En Cash Your Watch, convertimos patrimonio en acceso, confianza en
              respaldo y valor en oportunidades.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Photo
            src="/images/quienes-somos.png"
            alt="Reloj de lujo Cash Your Watch"
            className="aspect-[4/3] w-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
      </Container>
    </section>
  );
}
