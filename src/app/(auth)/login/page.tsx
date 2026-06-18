import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-2 text-center font-serif text-3xl text-cyw-white">
        Bienvenido
      </h1>
      <p className="mb-10 text-center text-sm text-cyw-white/50">
        Accede a tu cuenta para continuar tu solicitud.
      </p>
      <LoginForm />
    </div>
  );
}
