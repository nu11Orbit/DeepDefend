"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { analyzeVideo } from "@/lib/api"
import { VerdictBadge } from "./verdict-badge"
import { ConfidenceBar } from "./confidence-bar"
import LoaderOverlay from "@/components/loader-overlay"
import { Loader2 } from "lucide-react"

type Result = {
  analysis_id: string
  verdict: string
  confidence: number
  timestamp: string
}

export function UploadCard({
  onAnalyzed,
}: {
  onAnalyzed: (result: Result) => void
}) {
  const [file, setFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [result, setResult] = React.useState<Result | null>(null)

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
      console.log("[v0] Starting analysis for:", {
        name: file.name,
        sizeBytes: file.size,
        type: file.type,
      })
      const res = await analyzeVideo(file, 2.0)
      const r: Result = {
        analysis_id: res.analysis_id,
        verdict: res.verdict,
        confidence: Math.round(res.confidence ?? 0),
        timestamp: res.timestamp,
      }
      console.log("[v0] Analysis success:", r)
      setResult(r)
      onAnalyzed(r)
    } catch (e: any) {
      console.log("[v0] Analysis error:", e)
      setError(e?.message || "Analysis failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <LoaderOverlay active={loading} text="Uploading and analyzing… This may take a moment." />
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
            <Button onClick={onAnalyze} disabled={loading || !file}>
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Verdict</p>
                  <VerdictBadge verdict={result.verdict} />
                </div>
                <ConfidenceBar value={result.confidence} />
                <p className="text-xs text-muted-foreground">
                  Analyzed at {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
