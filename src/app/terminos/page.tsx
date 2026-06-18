import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function Page() {
  return (
    <LegalPage title="Términos y condiciones" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        Estos términos regulan el uso de la plataforma como herramienta para
        iniciar y dar seguimiento a una solicitud de evaluación.
      </p>

      <LegalSection heading="Alcance de la plataforma">
        <p>
          Cash Your Watch es únicamente una herramienta digital para recibir
          solicitudes y archivos. No procesa pagos ni formaliza operaciones.
          Cualquier evaluación, aprobación y formalización se realiza de manera
          presencial, fuera de la plataforma.
        </p>
      </LegalSection>

      <LegalSection heading="Sin oferta vinculante">
        <p>
          El envío de una solicitud no constituye una oferta ni una obligación;
          es el inicio de un proceso de evaluación.
        </p>
      </LegalSection>

      <LegalSection heading="Responsabilidad del usuario">
        <p>
          Eres responsable de la veracidad y legitimidad de la información y los
          archivos que proporcionas, así como de mantener la confidencialidad de
          tu cuenta.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
