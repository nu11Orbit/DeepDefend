"use client"
import Link from "next/link"
import { ThreeHero } from "@/components/three-hero"
import { RecentAnalyses } from "@/components/recent-analyses"
import { SystemStats } from "@/components/system-stats"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4">
      {/* 3D Hero */}
      <section className="relative w-full">
        <ThreeHero />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto rounded-lg bg-background/70 p-4 backdrop-blur">
            <h1 className="text-balance text-center text-2xl font-semibold tracking-tight md:text-3xl">
              DeepDefend – Deepfake Detection
            </h1>
            <p className="mt-2 text-pretty text-center text-sm text-muted-foreground">
              Upload a video for analysis and receive a verdict, confidence score, and interval insights.
            </p>
            <div className="mt-4 flex justify-center">
              <Button asChild size="sm">
                <Link href="/upload">Go to Upload</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar content */}
      <div className="grid grid-cols-1 gap-6 py-8 lg:grid-cols-2">
        <RecentAnalyses />
        <SystemStats />
      </div>

      <footer className="mb-8 text-center text-xs text-muted-foreground">
        {"Service: DeepDefend API • Minimal UI • "}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-dotted underline-offset-4"
        >
          Built on Next.js
        </a>
      </footer>
    </main>
  )
}
