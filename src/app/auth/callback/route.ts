import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback de autenticación (flujo PKCE).
 * Aquí caen los enlaces de los correos de Supabase:
 *  - Confirmación de cuenta (registro)
 *  - Restablecer contraseña (con ?next=/restablecer)
 *
 * Intercambia el `code` por una sesión y redirige a `next`.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/perfil";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=enlace`);
}
