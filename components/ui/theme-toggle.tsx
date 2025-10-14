"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [dark, setDark] = React.useState<boolean>(true)

  React.useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains("dark")
      setDark(isDark)
    } catch {}
  }, [])

  const toggle = () => {
    try {
      const next = !dark
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
      setDark(next)
    } catch {}
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Toggle light and dark theme"
      className="h-9 w-9 rounded-full p-0 bg-transparent"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? <Moon aria-hidden className="h-5 w-5" /> : <Sun aria-hidden className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
