import "./globals.css";
import AppShell from "@/components/app-shell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-muted/30 text-foreground antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
