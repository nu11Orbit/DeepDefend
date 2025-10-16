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

      <footer className="mt-12 border-t border-gray-300 dark:border-gray-700 py-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} DeepDefend • AI Video Analysis
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="/privacy"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
