import { Container, ImagePlaceholder } from "./shared";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

export function SectionSeguridad() {
  return (
    <section className="border-t border-cyw-white/10 py-28 sm:py-40">
      <Container>
        <Reveal className="max-w-3xl">
          <SectionHeader
            index="04"
            eyebrow="Seguridad y autenticación"
            title={
              <>
                Protegemos el valor de tu{" "}
                <span className="font-light italic text-cyw-white/70">
                  patrimonio
                </span>
                .
              </>
            }
          />
          <p className="mt-7 max-w-xl leading-relaxed text-cyw-white/55">
            Mediante procesos seguros, verificación profesional y máxima
            confidencialidad en cada etapa del proceso.
          </p>
        </Reveal>

        {/* Galería con offset alterno (no un grid plano) */}
        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Reveal key={i} delay={i * 0.08}>
              <ImagePlaceholder
                className={`aspect-[3/4] w-full ${i % 2 === 1 ? "sm:translate-y-10" : ""}`}
              />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
