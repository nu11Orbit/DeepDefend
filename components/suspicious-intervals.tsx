"use client"
import useSWR from "swr"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { jsonFetch } from "@/lib/api"

type Interval = {
  interval_id: number
  time_range: string
  start: number
  end: number
  video_score: number
  audio_score: number
  combined_score: number
  verdict: string
}

export function SuspiciousIntervals({ analysisId }: { analysisId?: string }) {
  const { data, error, isLoading } = useSWR(
    analysisId ? `/intervals/${analysisId}` : null,
    (path) => jsonFetch<{ intervals: Interval[] }>(path),
    { refreshInterval: 0 },
  )

  if (!analysisId) return null

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Intervals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading interval details…</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Intervals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Failed to load intervals: {String(error.message || error)}</p>
        </CardContent>
      </Card>
    )
  }

  const intervals = (data?.intervals || []).filter((it) => it.verdict === "SUSPICIOUS")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suspicious Intervals</CardTitle>
      </CardHeader>
      <CardContent>
        {intervals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suspicious intervals detected.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {intervals.map((it) => (
              <AccordionItem key={it.interval_id} value={`interval-${it.interval_id}`}>
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-medium">{it.time_range}</span>
                    <span className="text-xs text-muted-foreground">{"Video/Audio scores"}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-md bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">Video score</p>
                      <p className="text-sm font-semibold">{(it.video_score ?? 0).toFixed(3)}</p>
                    </div>
                    <div className="rounded-md bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">Audio score</p>
                      <p className="text-sm font-semibold">{(it.audio_score ?? 0).toFixed(3)}</p>
                    </div>
                    <div className="rounded-md bg-secondary p-3">
                      <p className="text-xs text-muted-foreground">Combined</p>
                      <p className="text-sm font-semibold">{(it.combined_score ?? 0).toFixed(3)}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
