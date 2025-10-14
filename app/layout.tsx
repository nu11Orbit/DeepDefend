import type React from "react"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react"
import Link from "next/link"
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DeepDefend UI",
  description: "Frontend for DeepDefend API",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`
          try {
            const stored = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const isDark = stored ? stored === "dark" : prefersDark;
            document.documentElement.classList.toggle("dark", isDark);
          } catch {}
        `}</Script>
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <header className="border-b bg-background">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-sm font-semibold">
              DeepDefend
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/upload" className="text-sm text-muted-foreground hover:text-foreground">
                Upload
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <Suspense fallback={<div className="px-4 py-6">Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}
