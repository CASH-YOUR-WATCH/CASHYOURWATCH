import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo className="mb-12" />
      <p className="font-serif text-7xl text-cyw-white">404</p>
      <p className="mt-4 max-w-sm text-sm text-cyw-white/50">
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/" className="mt-10">
        <Button>Volver al inicio</Button>
      </Link>
    </main>
  );
}
