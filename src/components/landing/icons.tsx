import type { SVGProps } from "react";

/** Iconos de línea fina (stroke currentColor) al estilo del brandbook. */
function Svg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

// --- ¿Cómo funciona? --------------------------------------------------------
export function IconSolicitud(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </Svg>
  );
}

export function IconRevision(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m20 20-4.5-4.5" />
    </Svg>
  );
}

export function IconValuacion(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M6 3h12l3 5-9 13L3 8z" />
      <path d="M3 8h18M9 3l3 5 3-5M8 8l4 13 4-13" />
    </Svg>
  );
}

export function IconCita(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="1.5" />
      <path d="M3.5 9h17M8 3v3M16 3v3" />
      <path d="m9 14 2 2 3.5-3.5" />
    </Svg>
  );
}

export function IconFormalizacion(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M14 4v5h5" />
      <path d="m8 15 2.5 2.5L16 12" />
    </Svg>
  );
}

export function IconCapital(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M3 21h18M4 21V10M9 21V10M15 21V10M20 21V10" />
      <path d="M12 3 3 8h18z" />
    </Svg>
  );
}

// --- Qué nos diferencia -----------------------------------------------------
export function IconDiscrecion(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <circle cx="12" cy="15.5" r="1.2" />
    </Svg>
  );
}

export function IconEspecializacion(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M6 3h12l3 5-9 13L3 8z" />
      <path d="M3 8h18M9 3l3 5 3-5" />
    </Svg>
  );
}

export function IconLiquidez(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <path d="M3 16.5 9 10l3.5 3.5L21 5" />
      <path d="M21 9V5h-4" />
    </Svg>
  );
}

export function IconPlataforma(props: SVGProps<SVGSVGElement>) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="4.5" width="17" height="12" rx="1.5" />
      <path d="M8 20.5h8M12 16.5v4" />
    </Svg>
  );
}
