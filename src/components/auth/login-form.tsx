"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Correo" htmlFor="email">
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="Contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Iniciar sesión"}
      </Button>

      <div className="flex justify-between text-xs text-cyw-white/50">
        <Link href="/recuperar" className="hover:text-cyw-white">
          ¿Olvidaste tu contraseña?
        </Link>
        <Link href="/registro" className="hover:text-cyw-white">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
}
