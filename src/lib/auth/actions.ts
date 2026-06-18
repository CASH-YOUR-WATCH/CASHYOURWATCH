"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendWelcome } from "@/lib/email/notifications";

export type AuthState = {
  error?: string;
  message?: string;
  ok?: boolean;
};

/** URL base del sitio (para los enlaces de los correos). */
function siteURL() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3030").replace(
    /\/+$/,
    "",
  );
}

/** Traduce los errores más comunes de Supabase Auth al español. */
function traducirError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Correo o contraseña incorrectos.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ya existe una cuenta con este correo.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("email not confirmed"))
    return "Debes confirmar tu correo antes de iniciar sesión.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "El correo no es válido.";
  return "Ocurrió un error. Intenta de nuevo.";
}

// ---------------------------------------------------------------------------
// Iniciar sesión
// ---------------------------------------------------------------------------
export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Completa todos los campos." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: traducirError(error.message) };

  revalidatePath("/", "layout");
  redirect("/perfil");
}

// ---------------------------------------------------------------------------
// Crear cuenta
// ---------------------------------------------------------------------------
export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email || !password)
    return { error: "Completa nombre, correo y contraseña." };
  if (password.length < 6)
    return { error: "La contraseña debe tener al menos 6 caracteres." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // El trigger handle_new_user copia estos datos al perfil.
      data: { nombre, telefono },
      emailRedirectTo: `${siteURL()}/auth/callback`,
    },
  });

  if (error) return { error: traducirError(error.message) };

  // Correo de bienvenida (best-effort, no bloquea el registro).
  await sendWelcome(email, nombre);

  // Sin sesión => Supabase requiere confirmación por correo.
  if (!data.session) {
    return {
      ok: true,
      message:
        "Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja (y spam).",
    };
  }

  revalidatePath("/", "layout");
  redirect("/perfil");
}

// ---------------------------------------------------------------------------
// Cerrar sesión
// ---------------------------------------------------------------------------
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Solicitar restablecer contraseña (envía correo)
// ---------------------------------------------------------------------------
export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Escribe tu correo." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteURL()}/auth/callback?next=/restablecer`,
  });

  // No revelamos si el correo existe o no (buena práctica de seguridad).
  if (error && !error.message.toLowerCase().includes("rate"))
    return { error: traducirError(error.message) };

  return {
    ok: true,
    message:
      "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña.",
  };
}

// ---------------------------------------------------------------------------
// Establecer nueva contraseña (tras seguir el enlace del correo)
// ---------------------------------------------------------------------------
export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6)
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return {
      error: "El enlace expiró o no es válido. Solicita uno nuevo.",
    };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: traducirError(error.message) };

  revalidatePath("/", "layout");
  redirect("/perfil");
}

// ---------------------------------------------------------------------------
// Actualizar datos del perfil
// ---------------------------------------------------------------------------
export async function updateProfile(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!nombre) return { error: "El nombre no puede quedar vacío." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ nombre, telefono })
    .eq("id", user.id);

  if (error) return { error: "No se pudieron guardar los cambios." };

  revalidatePath("/perfil");
  return { ok: true, message: "Datos actualizados." };
}
