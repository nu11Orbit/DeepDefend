"use client"

import { Spinner } from "@/components/ui/spinner"

export function LoaderOverlay({
  active,
  text = "Processing...",
}: {
  active: boolean
  text?: string
}) {
  if (!active) return null
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
        <Spinner className="text-primary" />
        <span className="text-sm text-foreground">{text}</span>
      </div>
    </div>
  )
}

export default LoaderOverlay
