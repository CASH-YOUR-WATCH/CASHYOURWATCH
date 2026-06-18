import type { SVGProps } from "react";
import { Container } from "./shared";
import { SectionHeader } from "./section-header";
import { Reveal } from "./reveal";
import {
  IconDiscrecion,
  IconEspecializacion,
  IconLiquidez,
  IconPlataforma,
} from "./icons";

const ITEMS: {
  icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
  title: string;
  body: string;
}[] = [
  {
    icon: IconDiscrecion,
    title: "Atención discreta",
    body: "Privacidad y confianza en cada etapa.",
  },
  {
    icon: IconEspecializacion,
    title: "Especialización en activos de lujo",
    body: "Conocimiento experto para valorar lo excepcional.",
  },
  {
    icon: IconLiquidez,
    title: "Liquidez estratégica",
    body: "Capital inteligente cuando las oportunidades aparecen.",
  },
  {
    icon: IconPlataforma,
    title: "Plataforma moderna",
    body: "Tecnología diseñada para una experiencia eficiente.",
  },
];

export function SectionDiferenciadores() {
  return (
    <section className="border-t border-cyw-white/10 py-28 sm:py-40">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionHeader
              index="03"
              eyebrow="Qué nos diferencia"
              title={
                <>
                  Lo excepcional,{" "}
                  <span className="font-light italic text-cyw-white/70">
                    valorado
                  </span>
                  .
                </>
              }
            />
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-cyw-white/10">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              return (
                <Reveal key={it.title} delay={i * 0.06}>
                  <div className="group flex items-start gap-5 border-b border-cyw-white/10 py-8 sm:gap-7">
                    <span className="w-8 font-serif text-xl text-cyw-white/25 sm:text-2xl">
                      0{i + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl text-cyw-white sm:text-2xl">
                        {it.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-cyw-white/55">
                        {it.body}
                      </p>
                    </div>
                    <Icon className="mt-1 h-6 w-6 shrink-0 text-cyw-white/25 transition-colors duration-300 group-hover:text-cyw-white/70" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
