"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function RegistroForm() {
  const [state, formAction, pending] = useActionState(signup, initial);

  if (state.ok) {
    return <Alert kind="success">{state.message}</Alert>;
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Nombre completo" htmlFor="nombre">
        <Input id="nombre" name="nombre" type="text" required autoComplete="name" />
      </Field>

      <Field label="Teléfono" htmlFor="telefono">
        <Input id="telefono" name="telefono" type="tel" autoComplete="tel" />
      </Field>

      <Field label="Correo" htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-center text-xs text-cyw-white/50">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="hover:text-cyw-white">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
