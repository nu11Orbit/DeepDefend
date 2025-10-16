"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { jsonFetch, type HistoryItem } from "@/lib/api"
import { VerdictBadge } from "./verdict-badge"
import { WobbleCard } from "./ui/wobble-card"

export function RecentAnalyses() {
  const { data, error, isLoading } = useSWR<HistoryItem[]>("/history?limit=10", (path) => jsonFetch(path), {
    refreshInterval: 10000,
  })

  return (
    <WobbleCard
      containerClassName="bg-pink-800"
      className=""
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {error && <p className="text-sm text-destructive">Failed to load history.</p>}
          <ScrollArea className="h-72">
            <ul className="space-y-3">
              {(data || []).map((item) => (
                <li key={item.analysis_id} className="flex items-start justify-between gap-3 rounded-md border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.filename}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <VerdictBadge verdict={item.verdict} />
                    <span className="text-xs text-muted-foreground">{item.confidence}%</span>
                  </div>
                </li>
              ))}
              {!isLoading && !error && (data || []).length === 0 && (
                <li className="text-sm text-muted-foreground">No analyses yet.</li>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </WobbleCard>
  )
}
