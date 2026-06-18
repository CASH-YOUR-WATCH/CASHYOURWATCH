import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Políticas de cookies" };

export default function Page() {
  return (
    <LegalPage title="Políticas de cookies" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        Usamos cookies estrictamente necesarias para el funcionamiento del
        sitio.
      </p>

      <LegalSection heading="Qué usamos">
        <p>
          Cookies de sesión para mantener tu inicio de sesión seguro. No usamos
          cookies de publicidad ni de seguimiento de terceros.
        </p>
      </LegalSection>

      <LegalSection heading="Control">
        <p>
          Puedes eliminar las cookies desde tu navegador en cualquier momento;
          algunas funciones, como iniciar sesión, podrían dejar de operar.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
