import Link from "next/link";
import type { SVGProps } from "react";
import { Button } from "@/components/ui/button";
import { Container, SectionTitle } from "./shared";
import { Reveal } from "./reveal";
import {
  IconSolicitud,
  IconRevision,
  IconValuacion,
  IconCita,
  IconFormalizacion,
  IconCapital,
} from "./icons";

const STEPS: {
  icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
  title: string;
  body: string;
}[] = [
  {
    icon: IconSolicitud,
    title: "Solicitud digital",
    body: "Inicia tu evaluación compartiendo los detalles de tu activo.",
  },
  {
    icon: IconRevision,
    title: "Revisión inicial",
    body: "Analizamos la información y validamos la viabilidad de la solicitud.",
  },
  {
    icon: IconValuacion,
    title: "Valuación especializada",
    body: "Autenticamos y validamos el valor de tu activo con especialistas.",
  },
  {
    icon: IconCita,
    title: "Cita de verificación",
    body: "Agendamos la inspección física y la autenticación final.",
  },
  {
    icon: IconFormalizacion,
    title: "Formalización",
    body: "Concretamos el acuerdo mediante un proceso claro y seguro.",
  },
  {
    icon: IconCapital,
    title: "Acceso al capital",
    body: "Recibe tu capital de forma rápida, confidencial y transparente.",
  },
];

export function SectionComoFunciona() {
  return (
    <section id="como-funciona" className="bg-cyw-cream py-24 text-cyw-black sm:py-32">
      <Container>
        <Reveal>
          <SectionTitle tone="light">¿Cómo funciona?</SectionTitle>
        </Reveal>

        <Reveal className="mt-12 text-center">
          <h3 className="mx-auto max-w-3xl font-serif text-2xl uppercase leading-tight tracking-[0.06em] sm:text-4xl">
            Del patrimonio a la liquidez estratégica
          </h3>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06} className="text-center">
                <Icon className="mx-auto h-7 w-7 text-cyw-black/70" />
                <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-cyw-black/55">
                  {i + 1}. {s.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-cyw-black/50">
                  {s.body}
                </p>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16 text-center">
          <p className="mx-auto max-w-2xl leading-relaxed text-cyw-black/60">
            Un proceso diseñado para convertir el valor de tus activos en
            oportunidades, con seguridad, discreción y acompañamiento
            especializado en cada etapa.
          </p>
          <Link href="/registro" className="mt-8 inline-block">
            <Button variant="dark">Conocer más</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
