import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, SectionTitle } from "./shared";
import { Reveal } from "./reveal";
import { CoverFlow } from "./cover-flow";

const RELOJES = [1, 2, 3, 4, 5].map((n) => ({
  src: `/images/reloj-${n}.png`,
  alt: `Reloj de lujo ${n}`,
}));

export function SectionSeguridad() {
  return (
    <section className="overflow-hidden border-t border-cyw-white/10 py-24 sm:py-32">
      <Container>
        <Reveal className="text-center">
          <SectionTitle align="center">Seguridad y autenticación</SectionTitle>
          <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-cyw-white/60">
            Protegemos el valor de tu patrimonio mediante procesos seguros,
            verificación profesional y máxima confidencialidad.
          </p>
        </Reveal>

        {/* Galería 3D estilo Cover Flow (arrastra o usa las flechas). */}
        <Reveal className="mt-12">
          <CoverFlow images={RELOJES} />
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link href="/registro">
            <Button variant="outline">Ver más</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
