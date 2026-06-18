import type { Metadata } from "next";
import { RestablecerForm } from "@/components/auth/restablecer-form";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default function RestablecerPage() {
  return (
    <div>
      <h1 className="mb-2 text-center font-serif text-3xl text-cyw-white">
        Nueva contraseña
      </h1>
      <p className="mb-10 text-center text-sm text-cyw-white/50">
        Elige una contraseña segura para tu cuenta.
      </p>
      <RestablecerForm />
    </div>
  );
}
