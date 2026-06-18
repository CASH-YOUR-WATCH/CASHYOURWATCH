import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PerfilForm } from "@/components/auth/perfil-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Mi perfil" };

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Doble candado: el proxy ya protege, pero verificamos también aquí.
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, telefono, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-lg">
      <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
        Mi cuenta
      </p>
      <h1 className="mb-1 font-serif text-3xl text-cyw-white">
        {profile?.nombre ?? "Tu perfil"}
      </h1>
      <p className="mb-10 text-sm text-cyw-white/50">{user.email}</p>

      {profile?.role === "admin" && (
        <Link
          href="/admin"
          className="mb-8 inline-flex items-center gap-2 border border-cyw-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-cyw-white/70 transition-colors hover:border-cyw-white/50 hover:text-cyw-white"
        >
          Administrador · Ir al panel →
        </Link>
      )}

      {/* CTA: iniciar una nueva solicitud */}
      <div className="mb-12 flex flex-col gap-4 border border-cyw-white/15 bg-cyw-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-xl text-cyw-white">
            Inicia una solicitud
          </h2>
          <p className="mt-1 text-sm text-cyw-white/50">
            Captura tu reloj y recibe una evaluación profesional.
          </p>
        </div>
        <Link href="/solicitud" className="shrink-0">
          <Button>Solicitar evaluación</Button>
        </Link>
      </div>

      <h2 className="mb-5 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
        Mis datos
      </h2>
      <PerfilForm
        nombre={profile?.nombre ?? ""}
        telefono={profile?.telefono ?? ""}
      />
    </div>
  );
}
