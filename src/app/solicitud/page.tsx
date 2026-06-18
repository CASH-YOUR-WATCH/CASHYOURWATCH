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
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-cyw-white/10 px-6 py-5 sm:px-10">
        <Link href="/">
          <Logo className="origin-left scale-90" />
        </Link>
        <Link
          href="/perfil"
          className="text-xs uppercase tracking-[0.2em] text-cyw-white/50 transition-colors hover:text-cyw-white"
        >
          Salir
        </Link>
      </header>
      <main className="flex-1 px-6 py-12 sm:py-16">
        <SolicitudWizard
          initialNombre={profile?.nombre ?? ""}
          initialTelefono={profile?.telefono ?? ""}
        />
      </main>
    </div>
  );
}
