"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { analyzeVideo } from "@/lib/api"
import LoaderOverlay from "@/components/loader-overlay"
import { Loader2 } from "lucide-react"
import AnalysisReport from "@/components/analysis-report"
import { StaticWobbleCard } from "./ui/staticwobble-card"

type Result = {
  analysis_id: string
  verdict: string
  confidence: number
  timestamp: string
}

type FullAnalysisResult = {
  analysis_id: string
  verdict: string
  confidence: number
  timestamp: string
  overall_scores?: {
    overall_video_score?: number
    overall_audio_score?: number
    overall_combined_score?: number
  }
  detailed_analysis?: string
  suspicious_intervals?: Array<{
    interval: string
    video_score?: number
    audio_score?: number
    video_regions?: string[]
    audio_regions?: string[]
  }>
  total_intervals_analyzed?: number
  video_info?: { duration?: number; fps?: number; total_frames?: number; file_size_mb?: number }
  filename?: string
}

export function UploadCard({
  onAnalyzed,
}: {
  onAnalyzed: (result: Result) => void
}) {
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<FullAnalysisResult | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setError(null)
  }

  const onAnalyze = async () => {
    if (!file) {
      setError("Please select a video file first.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      console.log("Starting analysis for:", {
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
      })
      const res = await analyzeVideo(file, 2.0)
      const summary: Result = {
        analysis_id: res.analysis_id,
        verdict: res.verdict,
        confidence: Math.round(res.confidence ?? 0),
        timestamp: res.timestamp,
      }
      console.log("Analysis success:", summary)
      setResult(res)
      onAnalyzed(summary)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log("Analysis error:", e)
      setError(e?.message || "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoaderOverlay active={loading} text="Uploading and analyzing… This may take a moment." />
      <StaticWobbleCard containerClassName="bg-blue-900">
      <Card>
        <CardHeader>
          <CardTitle>DeepDefend – Analyze Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input
              type="file"
              accept="video/*"
              onChange={onFileChange}
              aria-label="Upload video file"
              disabled={loading}
            />
            <Button onClick={onAnalyze} disabled={loading || !file} className="bg-pink-500 text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Analyzing…</span>
                </>
              ) : (
                "Analyze Video"
              )}
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {result && (
            <>
              <Separator />
              <AnalysisReport data={result} />
            </>
          )}
        </CardContent>
      </Card>
      </StaticWobbleCard>
    </>
  )
}
