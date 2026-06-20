import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Políticas de cookies" };

export default function Page() {
  return (
    <LegalPage title="Política de cookies" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        Esta Política de Cookies explica qué cookies utiliza la plataforma de{" "}
        <strong className="text-cyw-white/80">Cash Your Watch</strong>, con qué
        finalidad y cómo puedes gestionarlas. Forma parte de nuestro{" "}
        <a href="/aviso-de-privacidad" className="underline hover:text-cyw-white">
          Aviso de Privacidad
        </a>
        .
      </p>

      <LegalSection heading="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que un sitio web almacena en
          tu dispositivo al navegarlo. Permiten que el sitio funcione
          correctamente, recuerde tu sesión y opere de forma segura.
        </p>
      </LegalSection>

      <LegalSection heading="2. Cookies que utilizamos">
        <p>
          Utilizamos exclusivamente{" "}
          <strong className="text-cyw-white/75">cookies estrictamente
          necesarias</strong>, indispensables para el funcionamiento del sitio:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-cyw-white/75">Cookies de sesión y
            autenticación:</strong> mantienen tu sesión iniciada de forma segura
            y permiten que accedas a tu cuenta y a tus solicitudes.
          </li>
          <li>
            <strong className="text-cyw-white/75">Cookies técnicas:</strong>{" "}
            preservan el estado y la seguridad de la navegación durante tu visita.
          </li>
        </ul>
        <p>
          <strong className="text-cyw-white/75">No utilizamos cookies de
          publicidad, de perfilado ni de seguimiento de terceros.</strong> No
          compartimos información de navegación con redes publicitarias.
        </p>
      </LegalSection>

      <LegalSection heading="3. Gestión y control de cookies">
        <p>
          Dado que solo empleamos cookies estrictamente necesarias para prestar el
          servicio que solicitas, no se requiere consentimiento adicional para su
          uso. Puedes eliminar o bloquear las cookies desde la configuración de tu
          navegador en cualquier momento; ten en cuenta que, si lo haces, algunas
          funciones —como iniciar sesión— podrían dejar de operar correctamente.
        </p>
      </LegalSection>

      <LegalSection heading="4. Cambios a esta política">
        <p>
          Podremos actualizar esta Política de Cookies para reflejar cambios en el
          sitio o en la normativa aplicable. Publicaremos cualquier modificación
          en esta misma página, indicando la fecha de la última actualización.
        </p>
      </LegalSection>

      <LegalSection heading="5. Contacto">
        <p>
          Si tienes dudas sobre el uso de cookies, escríbenos a{" "}
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
