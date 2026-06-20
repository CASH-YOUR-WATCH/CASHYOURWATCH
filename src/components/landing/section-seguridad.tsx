import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container, SectionTitle } from "./shared";
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
          {[1, 2, 3, 4, 5].map((n, i) => (
            <Reveal key={n} delay={i * 0.08}>
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={`/images/reloj-${n}.png`}
                  alt={`Reloj de lujo ${n}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-contain"
                />
              </div>
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
