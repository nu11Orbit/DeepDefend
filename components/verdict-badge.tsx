"use client"
import { cn } from "@/lib/utils"

export function VerdictBadge({ verdict }: { verdict?: string }) {
  const isDeepfake = verdict?.toUpperCase() === "DEEPFAKE"
  const classes = isDeepfake
    ? "bg-destructive text-destructive-foreground"
    : "bg-[var(--color-chart-2)] text-[var(--color-sidebar-primary-foreground)]"

  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", classes)}
      aria-live="polite"
    >
      {verdict || "—"}
    </span>
  )
}
