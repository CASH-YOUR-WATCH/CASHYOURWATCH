"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

type Tab = { href: string; label: string; icon: "solicitudes" | "perfil" };

const ICONS = {
  solicitudes: (
    <path d="M5 4h10l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M14 4v5h5 M8 13h8M8 16.5h5" />
  ),
  perfil: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M5 20a7 7 0 0 1 14 0" />,
  salir: <path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3 M10 8l-4 4 4 4 M6 12h11" />,
};

function Icono({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      {ICONS[name]}
    </svg>
  );
}

/** Barra de pestañas inferior estilo app (solo móvil). */
export function MobileTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid border-t border-cyw-white/10 bg-cyw-black/95 backdrop-blur lg:hidden"
      style={{
        gridTemplateColumns: `repeat(${tabs.length + 1}, 1fr)`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-col items-center gap-1.5 py-3 text-[9px] uppercase tracking-[0.15em] transition-colors ${
              active ? "text-cyw-white" : "text-cyw-white/45"
            }`}
          >
            <Icono name={t.icon} />
            {t.label}
          </Link>
        );
      })}
      <form action={logout} className="contents">
        <button
          type="submit"
          className="flex flex-col items-center gap-1.5 py-3 text-[9px] uppercase tracking-[0.15em] text-cyw-white/45"
        >
          <Icono name="salir" />
          Salir
        </button>
      </form>
    </nav>
  );
}
