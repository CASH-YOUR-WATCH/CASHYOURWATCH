import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/landing/legal-stub";

export const metadata: Metadata = { title: "Aviso de privacidad" };

export default function Page() {
  return (
    <LegalPage title="Aviso de privacidad integral" updated="junio de 2026">
      <p className="text-sm leading-relaxed text-cyw-white/55">
        En cumplimiento de la Ley Federal de Protección de Datos Personales en
        Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos
        del Aviso de Privacidad, <strong className="text-cyw-white/80">Cash Your
        Watch</strong> (en adelante, “Cash Your Watch” o “el Responsable”) pone a
        tu disposición el presente Aviso de Privacidad.
      </p>

      <LegalSection heading="1. Responsable del tratamiento">
        <p>
          Cash Your Watch es responsable del uso, tratamiento y protección de
          los datos personales que nos proporcionas. Para cualquier asunto
          relacionado con tus datos personales puedes contactarnos en el correo{" "}
          <a
            href="mailto:info@cashyourwatch.com"
            className="underline hover:text-cyw-white"
          >
            info@cashyourwatch.com
          </a>
          , que funge como nuestro Departamento de Datos Personales. Nuestro
          domicilio para oír y recibir notificaciones está disponible a través
          de dicho correo.
        </p>
      </LegalSection>

      <LegalSection heading="2. Datos personales que recabamos">
        <p>Para las finalidades de este aviso podemos recabar:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-cyw-white/75">Datos de identificación y
            contacto:</strong> nombre, teléfono y correo electrónico.
          </li>
          <li>
            <strong className="text-cyw-white/75">Datos del activo:</strong>{" "}
            marca, modelo, estado, valor estimado y monto deseado, así como
            fotografías del reloj.
          </li>
          <li>
            <strong className="text-cyw-white/75">Documentación de
            respaldo:</strong> factura, certificado, garantía o comprobante de
            propiedad que decidas adjuntar.
          </li>
        </ul>
        <p>
          A través de la plataforma <strong className="text-cyw-white/75">no
          recabamos datos personales sensibles ni información financiera o
          bancaria</strong>; la plataforma no procesa pagos.
        </p>
      </LegalSection>

      <LegalSection heading="3. Finalidades del tratamiento">
        <p>
          <strong className="text-cyw-white/75">Finalidades primarias</strong>{" "}
          (necesarias para la relación): recibir y registrar tu solicitud;
          analizar y validar la información del activo; autenticar y valuar el
          activo con especialistas; agendar la cita de verificación física;
          integrar y dar seguimiento a tu expediente; y contactarte respecto a
          tu solicitud.
        </p>
        <p>
          <strong className="text-cyw-white/75">Finalidades secundarias</strong>{" "}
          (opcionales): envío de comunicaciones informativas y mejora de
          nuestros servicios. Si no deseas que tus datos se traten para estas
          finalidades, puedes manifestarlo en cualquier momento escribiendo a{" "}
          <a
            href="mailto:info@cashyourwatch.com"
            className="underline hover:text-cyw-white"
          >
            info@cashyourwatch.com
          </a>
          . Tu negativa no será motivo para negarte los servicios.
        </p>
      </LegalSection>

      <LegalSection heading="4. Transferencias y encargados">
        <p>
          Cash Your Watch <strong className="text-cyw-white/75">no transfiere
          tus datos personales a terceros</strong> sin tu consentimiento, salvo
          en los supuestos previstos en el artículo 37 de la LFPDPPP (por
          ejemplo, requerimientos de autoridad competente). Algunos proveedores
          tecnológicos (alojamiento y almacenamiento) tratan datos por cuenta y
          bajo instrucciones del Responsable, en calidad de encargados y bajo
          obligaciones de confidencialidad y seguridad.
        </p>
      </LegalSection>

      <LegalSection heading="5. Conservación y medidas de seguridad">
        <p>
          Tus datos y archivos se almacenan de forma privada, con acceso
          restringido al personal autorizado. Implementamos medidas de seguridad
          administrativas, técnicas y físicas razonables para proteger tus datos
          contra daño, pérdida, alteración o acceso no autorizado. Conservamos
          tus datos por el tiempo necesario para cumplir las finalidades
          descritas y las obligaciones legales aplicables.
        </p>
      </LegalSection>

      <LegalSection heading="6. Derechos ARCO y revocación del consentimiento">
        <p>
          Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales,
          así como a Oponerte a su tratamiento (derechos ARCO), y a revocar tu
          consentimiento. Para ejercerlos, envía tu solicitud a{" "}
          <a
            href="mailto:info@cashyourwatch.com"
            className="underline hover:text-cyw-white"
          >
            info@cashyourwatch.com
          </a>{" "}
          indicando:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>tu nombre y un medio para comunicarte la respuesta;</li>
          <li>
            copia de una identificación que acredite tu identidad (o la
            representación legal correspondiente);
          </li>
          <li>la descripción clara de los datos y del derecho que deseas ejercer.</li>
        </ul>
        <p>
          Daremos respuesta en un plazo máximo de 20 días hábiles. También puedes
          limitar el uso o divulgación de tus datos por el mismo medio.
        </p>
      </LegalSection>

      <LegalSection heading="7. Uso de cookies">
        <p>
          El sitio utiliza cookies estrictamente necesarias para su
          funcionamiento y para mantener tu sesión de forma segura. Para más
          información consulta nuestra{" "}
          <a href="/cookies" className="underline hover:text-cyw-white">
            política de cookies
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="8. Cambios al aviso de privacidad">
        <p>
          Cualquier modificación a este aviso se publicará en{" "}
          <a href="/aviso-de-privacidad" className="underline hover:text-cyw-white">
            cashyourwatch.com.mx/aviso-de-privacidad
          </a>
          , indicando la fecha de la última actualización. Te recomendamos
          revisarlo periódicamente.
        </p>
      </LegalSection>

      <LegalSection heading="9. Consentimiento">
        <p>
          Al proporcionar tus datos personales a través de la plataforma y
          utilizar nuestros servicios, manifiestas que has leído este Aviso de
          Privacidad y otorgas tu consentimiento para el tratamiento de tus datos
          conforme a los términos aquí descritos.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
