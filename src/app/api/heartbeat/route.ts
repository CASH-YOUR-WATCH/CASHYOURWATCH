import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Keep-alive del proyecto Supabase (plan free se pausa tras 7 días inactivo).
 * Hace upsert de last_ping en la tabla `heartbeat`. Devuelve solo { ok }.
 *
 * Autoriza de dos formas (redundantes):
 *  - Header `Authorization: Bearer ${HEARTBEAT_SECRET}`  → cron de n8n
 *  - Sesión de admin válida                              → botón del panel
 */
async function isAuthorized(request: Request): Promise<boolean> {
  const secret = process.env.HEARTBEAT_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth === `Bearer ${secret}`) return true;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    return profile?.role === "admin";
  } catch {
    return false;
  }
}

async function ping() {
  const supabase = createAdminClient();
  await supabase
    .from("heartbeat")
    .upsert({ id: 1, last_ping: new Date().toISOString() });
}

async function handle(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await ping();
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  return handle(request);
}

// Permite cron sencillos por GET (con el header del secreto).
export async function GET(request: Request) {
  return handle(request);
}
