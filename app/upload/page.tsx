"use client"
import React from "react"
import Link from "next/link"
import { UploadCard } from "@/components/upload-card"
import { SuspiciousIntervals } from "@/components/suspicious-intervals"
import { Button } from "@/components/ui/button"

type Result = {
  analysis_id: string
  verdict: string
  confidence: number
  timestamp: string
}

export default function UploadPage() {
  const [lastResult, setLastResult] = React.useState<Result | null>(null)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">Upload Video</h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            Supported formats: MP4, MOV, AVI, MKV, WEBM. Max size 2MB.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </header>

      <section className="space-y-6">
        <UploadCard onAnalyzed={(r) => setLastResult(r)} />
        {lastResult?.analysis_id && <SuspiciousIntervals analysisId={lastResult.analysis_id} />}
      </section>
    </main>
  )
}
