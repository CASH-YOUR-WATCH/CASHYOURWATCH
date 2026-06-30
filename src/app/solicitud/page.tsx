import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/brand/logo";
import { SolicitudWizard } from "@/components/solicitud/wizard";

export const metadata: Metadata = { title: "Nueva solicitud" };

export default async function SolicitudPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, telefono")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-svh flex-col bg-cyw-cream text-cyw-black">
      <header className="flex items-center justify-between border-b border-cyw-black/10 px-6 py-5 sm:px-10">
        <Link href="/">
          <Logo tone="dark" className="origin-left scale-90" />
        </Link>
        <Link
          href="/perfil"
          className="text-xs uppercase tracking-[0.2em] text-cyw-black/50 transition-colors hover:text-cyw-black"
        >
          Salir
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 sm:py-14">
        <SolicitudWizard
          initialNombre={profile?.nombre ?? ""}
          initialTelefono={profile?.telefono ?? ""}
        />
      </main>
    </div>
  );
}
