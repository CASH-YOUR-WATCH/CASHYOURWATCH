"use client";

import { useActionState } from "react";
import {
  updateEmail,
  updateAccountPassword,
  type AuthState,
} from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const initial: AuthState = {};

export function AccountSecurity({ email }: { email: string }) {
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmail,
    initial,
  );
  const [pwState, pwAction, pwPending] = useActionState(
    updateAccountPassword,
    initial,
  );

  return (
    <div className="space-y-10">
      {/* Cambiar correo */}
      <form action={emailAction} className="space-y-4">
        <p className="text-sm text-cyw-white/50">
          Correo actual:{" "}
          <span className="text-cyw-white/85">{email}</span>
        </p>
        {emailState.error && <Alert>{emailState.error}</Alert>}
        {emailState.ok && <Alert kind="success">{emailState.message}</Alert>}
        <Field label="Nuevo correo" htmlFor="newEmail">
          <Input
            id="newEmail"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </Field>
        <Button type="submit" variant="outline" disabled={emailPending}>
          {emailPending ? "Enviando…" : "Cambiar correo"}
        </Button>
      </form>

      {/* Cambiar contraseña */}
      <form
        action={pwAction}
        className="space-y-4 border-t border-cyw-white/10 pt-9"
      >
        {pwState.error && <Alert>{pwState.error}</Alert>}
        {pwState.ok && <Alert kind="success">{pwState.message}</Alert>}
        <Field label="Nueva contraseña" htmlFor="newPw">
          <Input
            id="newPw"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Confirmar contraseña" htmlFor="confirmPw">
          <Input
            id="confirmPw"
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </Field>
        <Button type="submit" variant="outline" disabled={pwPending}>
          {pwPending ? "Guardando…" : "Cambiar contraseña"}
        </Button>
      </form>
    </div>
  );
}
