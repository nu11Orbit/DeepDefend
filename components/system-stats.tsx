"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jsonFetch, type Stats } from "@/lib/api"

export function SystemStats() {
  const { data, error, isLoading } = useSWR<Stats>("/stats", (path) => jsonFetch(path), {
    refreshInterval: 10000,
  })

  const stats = data || {
    total_analyses: 0,
    deepfakes_detected: 0,
    real_videos: 0,
    avg_confidence: 0,
    avg_video_score: 0,
    avg_audio_score: 0,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">Failed to load stats.</p>}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Total Analyses</p>
            <p className="text-lg font-semibold">{stats.total_analyses}</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Deepfakes</p>
            <p className="text-lg font-semibold">{stats.deepfakes_detected}</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Real Videos</p>
            <p className="text-lg font-semibold">{stats.real_videos}</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
            <p className="text-lg font-semibold">{stats.avg_confidence}%</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Avg Video Score</p>
            <p className="text-lg font-semibold">{stats.avg_video_score}</p>
          </div>
          <div className="rounded-md bg-secondary p-3">
            <p className="text-xs text-muted-foreground">Avg Audio Score</p>
            <p className="text-lg font-semibold">{stats.avg_audio_score}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
