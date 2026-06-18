import type { Metadata } from "next";
import { RegistroForm } from "@/components/auth/registro-form";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <div>
      <h1 className="mb-2 text-center font-serif text-3xl text-cyw-white">
        Crea tu cuenta
      </h1>
      <p className="mb-10 text-center text-sm text-cyw-white/50">
        El primer paso hacia tu evaluación, segura y discreta.
      </p>
      <RegistroForm />
    </div>
  );
}
