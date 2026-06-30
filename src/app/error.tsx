"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-serif text-4xl text-cyw-white">Algo salió mal</p>
      <p className="mt-4 max-w-sm text-sm text-cyw-white/50">
        Ocurrió un error inesperado. Intenta de nuevo.
      </p>
      <Button onClick={reset} className="mt-10">
        Reintentar
      </Button>
    </main>
  );
}
