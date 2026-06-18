import type { Metadata } from "next";
import { RecuperarForm } from "@/components/auth/recuperar-form";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <div>
      <h1 className="mb-2 text-center font-serif text-3xl text-cyw-white">
        Recupera tu acceso
      </h1>
      <p className="mb-10 text-center text-sm text-cyw-white/50">
        Te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <RecuperarForm />
    </div>
  );
}
