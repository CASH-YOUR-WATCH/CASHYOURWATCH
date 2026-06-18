"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function RestablecerForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Nueva contraseña" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>

      <Field label="Confirmar contraseña" htmlFor="confirm">
        <Input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </Button>
    </form>
  );
}
