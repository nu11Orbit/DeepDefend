"use client"
import React from "react"
import { cn } from "@/lib/utils"

export const StaticWobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode
  containerClassName?: string
  className?: string
}) => {
  return (
    <section
      className={cn(
        "mx-auto w-full bg-indigo-800 relative rounded-2xl overflow-hidden",
        containerClassName
      )}
      style={{
        boxShadow:
          "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.05), 0 4px 6px rgba(34, 42, 53, 0.08), 0 24px 108px rgba(47, 48, 55, 0.10)",
      }}
    >
      <div
        className="relative h-full [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.3),rgba(255,255,255,0))] sm:mx-0 sm:rounded-2xl overflow-hidden"
      >
        <div className={cn("h-full px-4 py-20 sm:px-10", className)}>
          <Noise />
          {children}
        </div>
      </div>
    </section>
  )
}

const Noise = () => (
  <div
    className="absolute inset-0 w-full h-full scale-[1.2] transform opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)] pointer-events-none"
    // style={{
    //   backgroundImage: "url(/noise.webp)",
    //   backgroundSize: "30%",
    // }}
  />
)
