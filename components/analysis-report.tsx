"use client"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import VerdictBadge from "@/components/verdict-badge"
import ConfidenceBar from "@/components/confidence-bar"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Download, FileDown } from "lucide-react"

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
  function handleDownloadJSON() {
    try {
      const payload = JSON.stringify(data ?? {}, null, 2)
      const blob = new Blob([payload], { type: "application/json" })
      const verdict = (data?.verdict || "analysis").toString().toLowerCase()
      const ts = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `deepdefend-${verdict}-${ts}.json`

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.log("[v0] Failed to download analysis JSON:", err)
    }
  }

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }

  function handleDownloadHTML() {
    try {
      const verdict = (data?.verdict || "analysis").toString().toUpperCase()
      const verdictColor =
        verdict === "DEEPFAKE"
          ? "#B91C1C" /* red-700 */
          : verdict === "REAL"
            ? "#15803D" /* green-700 */
            : "#334155" /* slate-700 */

      const confPct = typeof data?.confidence === "number" ? Math.max(0, Math.min(100, data.confidence)) : 0

      const os = data?.overall_scores || {}
      const vidPct = percent(os.overall_video_score)
      const audPct = percent(os.overall_audio_score)
      const combPct = percent(os.overall_combined_score)

      const intervals = Array.isArray(data?.suspicious_intervals) ? data!.suspicious_intervals! : []

      const ts = new Date().toISOString().replace(/[:.]/g, "-")
      const filename = `deepdefend-report-${verdict.toLowerCase()}-${ts}.html`

      const detailed = data?.detailed_analysis ? escapeHtml(data.detailed_analysis) : ""

      const rows = intervals
        .map((it) => {
          const v = percent(it.video_score)
          const a = percent(it.audio_score)
          return `<tr>
            <td>${escapeHtml(it.interval || "")}</td>
            <td>${v}%</td>
            <td>${a}%</td>
            <td>${escapeHtml((it.video_regions || []).join(", ") || "—")}</td>
            <td>${escapeHtml((it.audio_regions || []).join(", ") || "—")}</td>
          </tr>`
        })
        .join("")

      const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>DeepDefend Analysis Report - ${verdict}</title>
<style>
  :root {
    --bg: #0f172a; /* slate-900 */
    --fg: #e2e8f0; /* slate-200 */
    --card: #111827; /* gray-900 */
    --muted: #1f2937; /* gray-800 */
    --border: #334155; /* slate-700 */
    --primary: #0ea5e9; /* sky-500 */
    --accent: #eab308;  /* yellow-500 */
    --danger: #ef4444;  /* red-500 */
    --success: #22c55e; /* green-500 */
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #ffffff;
      --fg: #0f172a;
      --card: #f8fafc;
      --muted: #e5e7eb;
      --border: #d1d5db;
    }
  }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font: 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial;
    padding: 24px;
  }
  .container {
    max-width: 960px; margin: 0 auto;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  h1, h2, h3 { margin: 0 0 8px; }
  h1 { font-size: 22px; }
  h2 { font-size: 18px; margin-top: 16px; }
  .header {
    display:flex; align-items:center; justify-content:space-between; gap: 16px; flex-wrap: wrap;
  }
  .badge {
    display:inline-block; padding: 4px 10px; border-radius: 999px;
    font-weight: 600; color: white; background: ${verdictColor};
  }
  .row { display:flex; gap:16px; align-items:center; }
  .progress {
    width: 320px; max-width: 100%; height: 10px; background: var(--muted); border-radius: 999px; overflow:hidden;
  }
  .progress > span {
    display:block; height:100%; background: var(--primary); width: ${confPct}%;
  }
  .scores { display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; margin-top: 12px; }
  .score { background: var(--muted); border-radius: 8px; padding: 10px; }
  .score .bar { background: var(--border); height: 8px; border-radius: 999px; overflow:hidden; }
  .score .bar > span { display:block; height:100%; background: var(--accent); }
  table { width:100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
  th, td { border:1px solid var(--border); padding: 8px; text-align: left; vertical-align: top;}
  th { background: var(--muted); }
  .pre {
    background: var(--muted); border: 1px solid var(--border); border-radius: 8px;
    padding: 12px; white-space: pre-wrap;
  }
  .meta { color: #94a3b8; font-size: 12px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>DeepDefend Analysis Report</h1>
        <div class="meta">Generated: ${new Date().toLocaleString()}</div>
      </div>
      <div class="row">
        <span class="badge" aria-label="Verdict">${verdict}</span>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${confPct}">
          <span></span>
        </div>
        <div class="meta">Confidence: ${confPct}%</div>
      </div>
    </div>

    <h2>Overall Scores</h2>
    <div class="scores">
      <div class="score">
        <div>Overall Video Score: ${vidPct}%</div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${vidPct}">
          <span style="width:${vidPct}%"></span>
        </div>
      </div>
      <div class="score">
        <div>Overall Audio Score: ${audPct}%</div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${audPct}">
          <span style="width:${audPct}%"></span>
        </div>
      </div>
      <div class="score">
        <div>Overall Combined Score: ${combPct}%</div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${combPct}">
          <span style="width:${combPct}%"></span>
        </div>
      </div>
    </div>

    ${
      intervals.length
        ? `<h2>Suspicious Intervals</h2>
           <table>
             <thead><tr><th>Interval</th><th>Video</th><th>Audio</th><th>Video Regions</th><th>Audio Regions</th></tr></thead>
             <tbody>${rows}</tbody>
           </table>`
        : ""
    }

    ${
      detailed
        ? `<h2>Detailed Report</h2>
           <div class="pre">${detailed}</div>`
        : ""
    }
  </div>
</body>
</html>`

      const blob = new Blob([html], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.log("[v0] Failed to download HTML report:", err)
    }
  }

  const { verdict, confidence, overall_scores, detailed_analysis, suspicious_intervals } = data || {}

  return (
    <section aria-label="Deepfake Analysis Report" className="w-full rounded-lg border bg-card p-4 md:p-6">
      {/* Header: Verdict + Confidence + Download */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-pretty">Analysis Result</h2>
          {verdict ? <VerdictBadge verdict={verdict} /> : null}
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          {typeof confidence === "number" ? (
            <div className="w-full max-w-md md:w-80">
              <ConfidenceBar value={Math.max(0, Math.min(100, confidence))} />
              <p className="mt-1 text-xs text-muted-foreground">Confidence</p>
            </div>
          ) : null}

          <Button
            type="button"
            variant="default"
            size="sm"
            className="shrink-0"
            onClick={handleDownloadHTML}
            aria-label="Download Analysis Report"
            title="Download Analysis Report (HTML)"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Report
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={handleDownloadJSON}
            aria-label="Download Analysis JSON"
            title="Download Analysis JSON"
          >
            <Download className="mr-2 h-4 w-4" />
            JSON
          </Button>
        </div>
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
