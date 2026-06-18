"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Pierdo la propiedad de mi reloj?",
    a: "El modelo está diseñado para que conserves la propiedad de tu activo. Los términos específicos se detallan durante la formalización.",
  },
  {
    q: "¿Qué marcas aceptan?",
    a: "Trabajamos con relojería y activos de alto valor. Comparte los detalles en tu solicitud y nuestros especialistas evalúan la viabilidad.",
  },
  {
    q: "¿La información es confidencial?",
    a: "Sí. La discreción y la confidencialidad son parte central del proceso.",
  },
  {
    q: "¿Cómo recibo los recursos?",
    a: "Una vez formalizado el acuerdo, recibes el capital de forma segura, rápida y transparente.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t border-cyw-black/10">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="border-b border-cyw-black/10">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-5 py-7 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-sm text-cyw-black/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 font-serif text-xl text-cyw-black sm:text-2xl">
                {item.q}
              </span>
              <span
                className={`text-2xl font-light text-cyw-black/50 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]"
              }`}
            >
              <p className="overflow-hidden pl-9 text-sm leading-relaxed text-cyw-black/60 sm:text-base">
                {item.a}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
