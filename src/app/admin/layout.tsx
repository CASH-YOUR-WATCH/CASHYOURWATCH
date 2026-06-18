import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-cyw-white/10 px-6 py-5 sm:px-10">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Logo className="origin-left scale-90" />
          </Link>
          <span className="border border-cyw-white/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] text-cyw-white/60">
            Admin
          </span>
        </div>
        <nav className="flex items-center gap-5 sm:gap-7">
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.15em] text-cyw-white/60 transition-colors hover:text-cyw-white"
          >
            Solicitudes
          </Link>
          <LogoutButton />
        </nav>
      </header>
      <main className="flex-1 px-6 py-12 sm:px-10">{children}</main>
    </div>
  );
}
