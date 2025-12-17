"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onUpload = pathname?.startsWith("/upload") || pathname === "/";
  const onStatuses = pathname?.startsWith("/statuses");

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="font-semibold">ADSA</div>

          <nav className="flex gap-2">
            <Button variant={onUpload ? "default" : "outline"} asChild>
              <Link href="/upload">Загрузка</Link>
            </Button>
            <Button variant={onStatuses ? "default" : "outline"} asChild>
              <Link href="/statuses">Статусы</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-6">{children}</main>
    </div>
  );
}
