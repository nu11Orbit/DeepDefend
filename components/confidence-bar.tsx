"use client"
import { Progress } from "@/components/ui/progress"

export function ConfidenceBar({ value }: { value?: number }) {
  const v = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Confidence</p>
        <p className="text-sm font-medium">{v}%</p>
      </div>
      <Progress value={v} aria-label="Confidence score" />
    </div>
  )
}
