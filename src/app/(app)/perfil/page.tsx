import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PerfilForm } from "@/components/auth/perfil-form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/panel/status-badge";
import { formatDateShort } from "@/lib/format";
import type { ApplicationStatus } from "@/lib/applications";

export const metadata: Metadata = { title: "Mi cuenta" };

type AppRow = {
  id: string;
  folio: string;
  marca: string;
  modelo: string;
  status: ApplicationStatus;
  created_at: string;
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, telefono, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let apps: AppRow[] = [];
  if (!isAdmin) {
    const { data } = await supabase
      .from("applications")
      .select("id, folio, marca, modelo, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    apps = (data ?? []) as AppRow[];
  }

  const initials =
    (profile?.nombre ?? user.email ?? "?")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Cabecera de cuenta */}
      <div className="flex flex-col gap-6 border-b border-cyw-white/10 pb-10 sm:flex-row sm:items-center">
        <div className="relative h-24 w-24 shrink-0">
          <div className="cyw-ring absolute inset-0" />
          <div className="absolute inset-[7px] flex items-center justify-center rounded-full border border-cyw-white/10 bg-cyw-white/[0.03] font-serif text-2xl text-cyw-white">
            {initials}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
            Mi cuenta
          </p>
          <h1 className="mt-2 font-serif text-3xl text-cyw-white">
            {profile?.nombre ?? "Tu perfil"}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cyw-white/50">
            {user.email}
            {isAdmin && (
              <span className="border border-cyw-white/25 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-cyw-white/70">
                Administrador
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Contenido según rol */}
      {isAdmin ? (
        <div className="mt-10 flex flex-col gap-4 border border-cyw-white/15 bg-cyw-white/[0.02] p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-xl text-cyw-white">
              Panel administrativo
            </h2>
            <p className="mt-1 text-sm text-cyw-white/50">
              Gestiona todas las solicitudes, estados y notas internas.
            </p>
          </div>
          <Link href="/admin" className="shrink-0">
            <Button>Ir al panel</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
              Mis solicitudes
            </h2>
            <Link href="/solicitud">
              <Button size="sm">Nueva solicitud</Button>
            </Link>
          </div>

          {apps.length === 0 ? (
            <div className="mt-5 border border-dashed border-cyw-white/15 py-14 text-center">
              <p className="font-serif text-xl text-cyw-white/80">
                Aún no tienes solicitudes
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-cyw-white/50">
                Inicia tu primera evaluación y dale seguimiento desde aquí.
              </p>
              <Link href="/solicitud" className="mt-6 inline-block">
                <Button>Solicitar evaluación</Button>
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {apps.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/panel/${a.id}`}
                    className="group flex items-center justify-between gap-4 border border-cyw-white/10 bg-cyw-white/[0.02] px-5 py-4 transition-colors hover:border-cyw-white/25"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-base text-cyw-white">
                          #{a.folio}
                        </span>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="mt-1 truncate text-sm text-cyw-white/55">
                        {a.marca} {a.modelo} · {formatDateShort(a.created_at)}
                      </p>
                    </div>
                    <span className="text-cyw-white/30 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mis datos */}
      <div className="mt-12 border-t border-cyw-white/10 pt-10">
        <h2 className="mb-6 text-[11px] uppercase tracking-[0.3em] text-cyw-white/40">
          Mis datos
        </h2>
        <PerfilForm
          nombre={profile?.nombre ?? ""}
          telefono={profile?.telefono ?? ""}
        />
      </div>
    </div>
  );
}
