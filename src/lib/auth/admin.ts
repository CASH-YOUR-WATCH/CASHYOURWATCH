import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Verifica que haya un usuario admin. Si no hay sesión → /login; si no es
 * admin → /panel. Devuelve el usuario admin. Se usa en el layout, las páginas
 * y las server actions del panel admin (defensa en profundidad).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/panel");

  return user;
}
