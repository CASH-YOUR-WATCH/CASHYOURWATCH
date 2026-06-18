"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function RecuperarForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initial,
  );

  if (state.ok) {
    return (
      <div className="space-y-6">
        <Alert kind="success">{state.message}</Alert>
        <Link
          href="/login"
          className="block text-center text-xs text-cyw-white/50 hover:text-cyw-white"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Correo" htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enviando…" : "Enviar enlace"}
      </Button>

      <Link
        href="/login"
        className="block text-center text-xs text-cyw-white/50 hover:text-cyw-white"
      >
        Volver a iniciar sesión
      </Link>
    </form>
  );
}
