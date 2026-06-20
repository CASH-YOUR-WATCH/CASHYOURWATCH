import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
// import { CursorTrail } from "@/components/cursor-trail"; // desactivado temporalmente (rastro de partículas)

/* --- Tipografía ---------------------------------------------------------
   Qlassy (display) y Houstiq (acento) son fuentes comerciales que el cliente
   aún no entrega. Mientras tanto:
   - Cuerpo  → Montserrat (Google)
   - Display → Cormorant Garamond (serif elegante, fallback de Qlassy)
   Cuando lleguen los archivos, se sustituyen aquí con next/font/local sin
   tocar el resto del código (las utilidades font-sans / font-serif no cambian).
-------------------------------------------------------------------------- */
const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030",
  ),
  title: {
    default: "Cash Your Watch — Capital inteligente respaldado por activos de lujo",
    template: "%s · Cash Your Watch",
  },
  description:
    "Accede a liquidez inmediata mediante un proceso profesional, seguro y discreto, respaldado por relojes y activos de alto valor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* <CursorTrail /> — rastro de partículas, desactivado por ahora */}
        {children}
      </body>
    </html>
  );
}
