import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { MobileTabs } from "@/components/app/mobile-tabs";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header desktop */}
      <header className="hidden items-center justify-between gap-4 border-b border-cyw-white/10 px-6 py-5 sm:px-10 lg:flex">
        <Link href="/">
          <Logo className="origin-left scale-90" />
        </Link>
        <nav className="flex items-center gap-7">
          <Link
            href="/panel"
            className="text-xs uppercase tracking-[0.15em] text-cyw-white/60 transition-colors hover:text-cyw-white"
          >
            Solicitudes
          </Link>
          <Link
            href="/perfil"
            className="text-xs uppercase tracking-[0.15em] text-cyw-white/60 transition-colors hover:text-cyw-white"
          >
            Perfil
          </Link>
          <LogoutButton />
        </nav>
      </header>

      {/* Header móvil compacto (sticky) */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-cyw-white/10 bg-cyw-black/90 px-5 py-4 backdrop-blur lg:hidden">
        <Link href="/" className="font-serif text-xl leading-none tracking-tight text-cyw-white">
          CYW
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyw-white/40">
          Cash Your Watch
        </span>
      </header>

      <main className="flex-1 px-5 pb-28 pt-7 sm:px-10 lg:pb-12 lg:pt-12">
        {children}
      </main>

      <MobileTabs
        tabs={[
          { href: "/panel", label: "Solicitudes", icon: "solicitudes" },
          { href: "/perfil", label: "Perfil", icon: "perfil" },
        ]}
      />
    </div>
  );
}
