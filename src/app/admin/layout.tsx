import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { MobileTabs } from "@/components/app/mobile-tabs";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Header desktop */}
      <header className="hidden items-center justify-between gap-4 border-b border-cyw-white/10 px-6 py-5 sm:px-10 lg:flex">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Logo className="origin-left scale-90" />
          </Link>
          <span className="border border-cyw-white/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-cyw-white/60">
            Admin
          </span>
        </div>
        <nav className="flex items-center gap-7">
          <Link
            href="/admin"
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
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-xl leading-none tracking-tight text-cyw-white">
            CYW
          </span>
          <span className="border border-cyw-white/20 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-cyw-white/60">
            Admin
          </span>
        </Link>
      </header>

      <main className="flex-1 px-5 pb-28 pt-7 sm:px-10 lg:pb-12 lg:pt-12">
        {children}
      </main>

      <MobileTabs
        tabs={[
          { href: "/admin", label: "Solicitudes", icon: "solicitudes" },
          { href: "/perfil", label: "Perfil", icon: "perfil" },
        ]}
      />
    </div>
  );
}
