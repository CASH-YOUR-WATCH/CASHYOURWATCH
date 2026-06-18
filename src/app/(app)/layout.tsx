import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-cyw-white/10 px-6 py-5 sm:px-10">
        <Link href="/">
          <Logo className="origin-left scale-90" />
        </Link>
        <nav className="flex items-center gap-5 sm:gap-7">
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
      <main className="flex-1 px-6 py-12 sm:px-10">{children}</main>
    </div>
  );
}
