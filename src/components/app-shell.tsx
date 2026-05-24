"use client";

import Link from "next/link";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid place-items-center rounded-xl border bg-background px-3 py-2 shadow-sm">
              <span className="text-[20px] font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ADSA
              </span>
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                Architectural Diagrams Security Analyzer
              </div>
              <div className="text-xs text-muted-foreground">
                Upload • Queue • Status • Download
              </div>
            </div>
          </Link>

          {/* Nav */}
          <nav aria-label="Основная навигация" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </div>
  );
}
