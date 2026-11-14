import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Violy — Hear Every Note. See Your Progress.",
  description:
    "Smart music practice. Violy listens as you play, gives useful pitch and rhythm feedback, and keeps scores, demonstrations and accompaniment in one focused practice space.",
};

export const viewport: Viewport = {
  themeColor: "#2f7ff5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
