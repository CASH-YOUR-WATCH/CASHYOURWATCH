import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-12 flex justify-center">
          <Logo />
        </Link>
        {children}
      </div>
    </main>
  );
}
