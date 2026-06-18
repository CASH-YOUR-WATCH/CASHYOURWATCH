"use client";

import { useActionState } from "react";
import { updateProfile, type AuthState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function PerfilForm({
  nombre,
  telefono,
}: {
  nombre: string;
  telefono: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}
      {state.ok && <Alert kind="success">{state.message}</Alert>}

      <Field label="Nombre completo" htmlFor="nombre">
        <Input id="nombre" name="nombre" type="text" required defaultValue={nombre} />
      </Field>

      <Field label="Teléfono" htmlFor="telefono">
        <Input
          id="telefono"
          name="telefono"
          type="tel"
          defaultValue={telefono}
        />
      </Field>

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
