import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function Page() {
  return (
    <LegalPage title="Términos y condiciones de uso" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        Los presentes Términos y Condiciones (los “Términos”) regulan el acceso y
        uso del sitio y la plataforma de{" "}
        <strong className="text-cyw-white/80">Cash Your Watch</strong> (la
        “Plataforma”). Al registrarte o utilizar la Plataforma, manifiestas que
        has leído, entendido y aceptado estos Términos. Si no estás de acuerdo, te
        pedimos abstenerte de usar la Plataforma.
      </p>

      <LegalSection heading="1. Objeto y naturaleza del servicio">
        <p>
          La Plataforma es una herramienta digital cuyo único propósito es la{" "}
          <strong className="text-cyw-white/75">recepción de solicitudes y la
          carga de archivos</strong> (fotografías y documentación) relacionados
          con relojes y activos de lujo, para su posterior análisis por parte de
          Cash Your Watch.
        </p>
        <p>
          La Plataforma <strong className="text-cyw-white/75">no procesa pagos,
          no otorga créditos ni formaliza operación alguna</strong>. Toda
          evaluación, valuación, aprobación y formalización del trámite se realiza
          de manera <strong className="text-cyw-white/75">presencial</strong>,
          fuera del entorno digital, una vez verificado físicamente el activo.
        </p>
      </LegalSection>

      <LegalSection heading="2. Ausencia de oferta vinculante">
        <p>
          El envío de una solicitud a través de la Plataforma{" "}
          <strong className="text-cyw-white/75">no constituye una oferta
          vinculante ni obligación</strong> de contratar por parte de Cash Your
          Watch. Cualquier monto, estimación o cifra mostrada es meramente
          referencial y está sujeta a verificación física, autenticación y
          valuación profesional del activo. Cash Your Watch se reserva el derecho
          de aceptar o rechazar cualquier solicitud a su entera discreción.
        </p>
      </LegalSection>

      <LegalSection heading="3. Registro y cuenta de usuario">
        <p>
          Para utilizar la Plataforma debes crear una cuenta proporcionando
          información veraz, exacta y actualizada. Eres responsable de mantener la
          confidencialidad de tus credenciales y de toda actividad realizada bajo
          tu cuenta. Debes ser mayor de edad y contar con plena capacidad legal
          para celebrar actos jurídicos.
        </p>
      </LegalSection>

      <LegalSection heading="4. Obligaciones del usuario">
        <p>Al usar la Plataforma te comprometes a:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            proporcionar información y documentación{" "}
            <strong className="text-cyw-white/75">veraz y legítima</strong>;
          </li>
          <li>
            declarar que eres el{" "}
            <strong className="text-cyw-white/75">propietario legítimo</strong>{" "}
            del activo o que cuentas con facultades suficientes para disponer de
            él, y que su procedencia es lícita;
          </li>
          <li>
            no utilizar la Plataforma para fines fraudulentos, ilícitos o
            relacionados con bienes de procedencia ilegítima;
          </li>
          <li>
            no vulnerar la seguridad de la Plataforma ni los derechos de terceros.
          </li>
        </ul>
        <p>
          El usuario es el único responsable de la veracidad de la información y
          de la legítima propiedad y procedencia de los activos que registre.
        </p>
      </LegalSection>

      <LegalSection heading="5. Propiedad intelectual">
        <p>
          Todos los elementos de la Plataforma —marca, logotipos, nombre
          comercial, diseño, textos, gráficos y software— son propiedad de Cash
          Your Watch o de sus titulares y están protegidos por las leyes
          aplicables. Queda prohibida su reproducción, distribución o uso sin
          autorización previa y por escrito.
        </p>
      </LegalSection>

      <LegalSection heading="6. Limitación de responsabilidad">
        <p>
          La Plataforma se proporciona “tal cual” y “según disponibilidad”. Cash
          Your Watch no garantiza la disponibilidad ininterrumpida del servicio y
          no será responsable por daños derivados de fallas técnicas, suspensión
          del servicio o del uso indebido de la Plataforma por parte del usuario.
          Dado que la Plataforma solo recibe solicitudes, ninguna decisión
          comercial se entiende tomada hasta la verificación y formalización
          presencial.
        </p>
      </LegalSection>

      <LegalSection heading="7. Privacidad y protección de datos">
        <p>
          El tratamiento de tus datos personales se rige por nuestro{" "}
          <a href="/aviso-de-privacidad" className="underline hover:text-cyw-white">
            Aviso de Privacidad
          </a>
          , que forma parte integral de estos Términos.
        </p>
      </LegalSection>

      <LegalSection heading="8. Modificaciones">
        <p>
          Cash Your Watch podrá modificar estos Términos en cualquier momento. Las
          modificaciones surtirán efecto a partir de su publicación en la
          Plataforma. El uso continuado tras la publicación implica la aceptación
          de los Términos vigentes.
        </p>
      </LegalSection>

      <LegalSection heading="9. Legislación aplicable y jurisdicción">
        <p>
          Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos.
          Para su interpretación y cumplimiento, el usuario y Cash Your Watch se
          someten a la jurisdicción de los tribunales competentes de México,
          renunciando a cualquier otro fuero que pudiera corresponderles.
        </p>
      </LegalSection>

      <LegalSection heading="10. Contacto">
        <p>
          Para cualquier duda sobre estos Términos puedes escribirnos a{" "}
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
