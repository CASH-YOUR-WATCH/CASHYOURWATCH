import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./shared";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";

const STEPS: { title: string; body: string }[] = [
  {
    title: "Solicitud digital",
    body: "Inicia tu evaluación compartiendo los detalles de tu activo.",
  },
  {
    title: "Revisión inicial",
    body: "Analizamos la información y validamos la viabilidad de la solicitud.",
  },
  {
    title: "Valuación especializada",
    body: "Autenticamos y validamos el valor de tu activo con especialistas.",
  },
  {
    title: "Cita de verificación",
    body: "Agendamos la inspección física y la autenticación final.",
  },
  {
    title: "Formalización",
    body: "Concretamos el acuerdo mediante un proceso claro y seguro.",
  },
  {
    title: "Acceso al capital",
    body: "Recibe tu capital de forma rápida, confidencial y transparente.",
  },
];

export function SectionComoFunciona() {
  return (
    <section id="como-funciona" className="bg-cyw-white py-28 text-cyw-black sm:py-40">
      <Container>
        <Reveal>
          <SectionHeader
            index="02"
            eyebrow="¿Cómo funciona?"
            tone="light"
            title={
              <>
                Del patrimonio a la{" "}
                <span className="font-light italic text-cyw-black/60">
                  liquidez
                </span>{" "}
                estratégica.
              </>
            }
          />
        </Reveal>

        <div className="mt-16 border-t border-cyw-black/10">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              <div className="group grid grid-cols-[3rem_1fr] items-baseline gap-5 border-b border-cyw-black/10 py-8 transition-colors hover:bg-cyw-black/[0.025] sm:grid-cols-[6rem_1fr] sm:gap-10 sm:py-10">
                <span className="font-serif text-4xl leading-none text-cyw-black/20 transition-colors group-hover:text-cyw-black/40 sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-12">
                  <h3 className="font-serif text-xl text-cyw-black sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-cyw-black/55">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-xl leading-relaxed text-cyw-black/60">
            Un proceso diseñado para convertir el valor de tus activos en
            oportunidades, con discreción y acompañamiento en cada etapa.
          </p>
          <Link href="/registro" className="shrink-0">
            <Button variant="dark">Conocer más</Button>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
