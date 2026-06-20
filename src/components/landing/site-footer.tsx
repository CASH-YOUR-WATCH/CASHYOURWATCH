import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const ENLACES = [
  { href: "/registro", label: "Solicitar evaluación" },
  { href: "#contacto", label: "Contacto" },
  { href: "#faq", label: "FAQ" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#quienes-somos", label: "¿Quiénes somos?" },
];

const LEGAL = [
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/cookies", label: "Políticas de cookies" },
];

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconLinkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-cyw-gray text-cyw-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-cyw-white/50">
            Capital inteligente respaldado por activos de lujo. Privado, seguro y
            profesional.
          </p>
        </div>

        <FooterCol title="Enlaces" items={ENLACES} />
        <FooterCol title="Legal" items={LEGAL} />

        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-cyw-white/40">
            Contacto
          </p>
          <ul className="mt-5 space-y-3 text-sm text-cyw-white/70">
            <li>
              <a
                href="mailto:info@cashyourwatch.com"
                className="transition-colors hover:text-cyw-white"
              >
                info@cashyourwatch.com
              </a>
            </li>
            <li className="text-cyw-white/50">+52 00 0000 0000</li>
          </ul>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-cyw-white/60 hover:text-cyw-white">
              <IconInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-cyw-white/60 hover:text-cyw-white">
              <IconLinkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cyw-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 sm:px-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyw-white/40">
            © 2026 Cash Your Watch. Todos los derechos reservados.
          </p>
          <p className="mt-2 max-w-2xl text-[10px] leading-relaxed text-cyw-white/25">
            Plataforma de recepción de solicitudes. La evaluación, aprobación y
            formalización se realizan de forma presencial.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.25em] text-cyw-white/40">
        {title}
      </p>
      <ul className="mt-5 space-y-3 text-sm text-cyw-white/70">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="transition-colors hover:text-cyw-white">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
