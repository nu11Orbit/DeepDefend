"use client"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import VerdictBadge from "@/components/verdict-badge"
import ConfidenceBar from "@/components/confidence-bar"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

type SuspiciousInterval = {
  interval: string // "0.0-2.0"
  video_score?: number // 0..1
  audio_score?: number // 0..1
  video_regions?: string[]
  audio_regions?: string[]
}

type OverallScores = {
  overall_video_score?: number // 0..1
  overall_audio_score?: number // 0..1
  overall_combined_score?: number // 0..1
}

export type AnalysisReportData = {
  verdict?: "REAL" | "DEEPFAKE" | string
  confidence?: number // 0..100
  overall_scores?: OverallScores
  detailed_analysis?: string // markdown
  suspicious_intervals?: SuspiciousInterval[]
}

function percent(n?: number) {
  if (typeof n !== "number" || Number.isNaN(n)) return 0
  // If it's already 0..100 keep it, else convert from 0..1
  return n > 1 ? Math.max(0, Math.min(100, n)) : Math.round(n * 100)
}

function ScoreRow({
  label,
  value,
  className,
}: {
  label: string
  value?: number
  className?: string
}) {
  const pct = percent(value)
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      {/* simple progress bar themed via tokens */}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={cn("h-2 rounded-full", pct >= 70 ? "bg-destructive" : pct >= 40 ? "bg-accent" : "bg-primary")}
          style={{ width: `${pct}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          role="progressbar"
        />
      </div>
    </div>
  )
}

export default function AnalysisReport({ data }: { data: AnalysisReportData }) {
  const { verdict, confidence, overall_scores, detailed_analysis, suspicious_intervals } = data || {}

  return (
    <section aria-label="Deepfake Analysis Report" className="w-full rounded-lg border bg-card p-4 md:p-6">
      {/* Header: Verdict + Confidence */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-pretty">Analysis Result</h2>
          {verdict ? <VerdictBadge verdict={verdict} /> : null}
        </div>
        {typeof confidence === "number" ? (
          <div className="w-full max-w-md md:w-80">
            <ConfidenceBar value={Math.max(0, Math.min(100, confidence))} />
            <p className="mt-1 text-xs text-muted-foreground">Confidence</p>
          </div>
        ) : null}
      </div>

      {/* Overall Scores */}
      {overall_scores ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ScoreRow label="Overall Video Score" value={overall_scores.overall_video_score} />
          <ScoreRow label="Overall Audio Score" value={overall_scores.overall_audio_score} />
          <ScoreRow label="Overall Combined Score" value={overall_scores.overall_combined_score} />
        </div>
      ) : null}

      {/* Detailed Report (Markdown) */}
      {detailed_analysis ? (
        <div className="mt-6">
          <h3 className="mb-2 text-base font-semibold">Detailed Report</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {/* Using react-markdown to render the analysis text */}
            <ReactMarkdown>{detailed_analysis}</ReactMarkdown>
          </div>
        </div>
      ) : null}

      {/* Suspicious Intervals */}
      {Array.isArray(suspicious_intervals) && suspicious_intervals.length > 0 ? (
        <div className="mt-6">
          <h3 className="mb-2 text-base font-semibold">Suspicious Intervals</h3>
          <Accordion type="multiple" className="w-full">
            {suspicious_intervals.map((it, idx) => {
              const vidPct = percent(it.video_score)
              const audPct = percent(it.audio_score)
              return (
                <AccordionItem key={`${it.interval}-${idx}`} value={`${it.interval}-${idx}`}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="font-medium">Interval {it.interval || idx}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5",
                            vidPct >= 70
                              ? "bg-destructive text-destructive-foreground"
                              : vidPct >= 40
                                ? "bg-accent text-accent-foreground"
                                : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          Video {vidPct}%
                        </span>
                        <span
                          className={cn(
                            "rounded px-2 py-0.5",
                            audPct >= 70
                              ? "bg-destructive text-destructive-foreground"
                              : audPct >= 40
                                ? "bg-accent text-accent-foreground"
                                : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          Audio {audPct}%
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <ScoreRow label="Video Score" value={it.video_score} />
                      <ScoreRow label="Audio Score" value={it.audio_score} />
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Video regions</p>
                          <div className="flex flex-wrap gap-2">
                            {(it.video_regions || ["none"]).map((r, i) => (
                              <span
                                key={`${r}-${i}`}
                                className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-medium text-muted-foreground">Audio regions</p>
                          <div className="flex flex-wrap gap-2">
                            {(it.audio_regions || ["none"]).map((r, i) => (
                              <span
                                key={`${r}-${i}`}
                                className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      ) : null}
    </section>
  )
}
