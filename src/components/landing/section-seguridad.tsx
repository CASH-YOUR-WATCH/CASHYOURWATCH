import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, ImagePlaceholder, SectionTitle } from "./shared";
import { Reveal } from "./reveal";

export function SectionSeguridad() {
  return (
    <section className="border-t border-cyw-white/10 py-24 sm:py-32">
      <Container>
        <Reveal className="text-center">
          <SectionTitle align="center">Seguridad y autenticación</SectionTitle>
          <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-cyw-white/60">
            Protegemos el valor de tu patrimonio mediante procesos seguros,
            verificación profesional y máxima confidencialidad.
          </p>
        </Reveal>

        {/* Fila pareja de 5 relojes (como el mockup). */}
        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-5 sm:gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <Reveal key={i} delay={i * 0.08}>
              <ImagePlaceholder className="aspect-[3/4] w-full" />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Link href="/registro">
            <Button variant="outline">Ver más</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
