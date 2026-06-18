import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase (renueva el token) en cada request y
 * sincroniza las cookies entre el request y la respuesta.
 *
 * Se llama desde `src/proxy.ts` (lo que en Next.js < 16 era `middleware`).
 * La protección de rutas por rol (user/admin) se agrega en la Fase 3 (Auth).
 */
export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mientras Supabase no esté configurado (env vacío), no intentamos refrescar
  // la sesión. El sitio debe funcionar igual. Cuando llenes .env.local, este
  // bloque se activa solo.
  if (!url || !anonKey) {
    return response;
  }

  let sessionResponse = response;

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          sessionResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            sessionResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: no metas lógica entre createServerClient y getUser().
  // getUser() revalida el token con el servidor de Supabase en cada request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = ["/perfil", "/solicitud", "/panel", "/admin"].some(
    (p) => path === p || path.startsWith(p + "/"),
  );
  const isAuthPage = ["/login", "/registro", "/recuperar"].some(
    (p) => path === p,
  );

  // Sin sesión en ruta protegida → al login (recordando a dónde quería ir).
  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Con sesión en páginas de login/registro → a su perfil.
  if (user && isAuthPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/perfil";
    redirectUrl.search = "";
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Conserva las cookies de sesión refrescadas en el redirect.
    sessionResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return sessionResponse;
}
