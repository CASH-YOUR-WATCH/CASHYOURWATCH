import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Aviso de privacidad" };

export default function Page() {
  return (
    <LegalPage title="Aviso de privacidad" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        Cash Your Watch recaba tus datos únicamente para recibir y dar
        seguimiento a tu solicitud de evaluación.
      </p>

      <LegalSection heading="Datos que recabamos">
        <p>
          Los que proporcionas al crear tu cuenta e iniciar una solicitud:
          nombre, datos de contacto, información del activo y los archivos
          (fotografías y documentos) que subes.
        </p>
      </LegalSection>

      <LegalSection heading="Para qué los usamos">
        <p>
          Únicamente para recibir, evaluar y dar seguimiento a tu solicitud, y
          para contactarte. La plataforma no realiza trámites ni operaciones:
          todo proceso formal se realiza de manera presencial.
        </p>
      </LegalSection>

      <LegalSection heading="Resguardo">
        <p>
          Tus archivos se almacenan de forma privada, con acceso restringido a
          personal autorizado.
        </p>
      </LegalSection>

      <LegalSection heading="Tus derechos">
        <p>
          Puedes solicitar el acceso, rectificación o eliminación de tus datos
          escribiendo a{" "}
          <a
            href="mailto:info@cashyourwatch.com"
            className="underline hover:text-cyw-white"
          >
            info@cashyourwatch.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
