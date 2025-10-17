export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")) ||
  "/api"

if (typeof window !== "undefined") {
  console.log("API_BASE resolved to:", API_BASE)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function jsonFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  // e.log("jsonFetch ->", url)
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = (data && (data.error || data.detail || data.message)) || "Request failed"
    throw new Error(`${message} [${res.status}] ${url}`)
  }
  return data
}

export async function analyzeVideo(file: File, intervalDuration = 2.0) {
  const form = new FormData()
  form.append("file", file)
  const qs = new URLSearchParams({ interval_duration: String(intervalDuration) }).toString()
  const url = `${API_BASE}/analyze?${qs}`

  // console.log("analyzeVideo POST ->", url, {
  //   fileName: file.name,
  //   fileSizeBytes: file.size,
  //   fileType: file.type,
  // })

  const res = await fetch(url, {
    method: "POST",
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = (data && (data.error || data.detail || data.message)) || "Analysis failed"
    throw new Error(`${message} [${res.status}] ${url}`)
  }
  return data as {
    analysis_id: string
    verdict: "REAL" | "DEEPFAKE" | string
    confidence: number
    overall_scores?: {
      overall_video_score?: number
      overall_audio_score?: number
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    suspicious_intervals?: any[]
    total_intervals_analyzed?: number
    video_info?: { duration?: number; fps?: number; total_frames?: number; file_size_mb?: number }
    filename?: string
    timestamp: string
  }
}

export type HistoryItem = {
  analysis_id: string
  filename: string
  verdict: "REAL" | "DEEPFAKE" | string
  confidence: number
  timestamp: string
  video_duration: number
}

export type Stats = {
  total_analyses: number
  deepfakes_detected: number
  real_videos: number
  avg_confidence: number
  avg_video_score: number
  avg_audio_score: number
}
