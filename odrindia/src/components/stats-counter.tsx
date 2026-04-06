"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface StatsCounterProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function StatsCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = "",
  suffix = "",
  className,
}: StatsCounterProps) {
  const [count, setCount] = useState(start)
  const countRef = useRef<number>(start)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp
        }

        const progress = timestamp - startTimeRef.current
        const percentage = Math.min(progress / duration, 1)

        // Easing function for smoother animation
        const easeOutQuad = (t: number) => t * (2 - t)
        const easedProgress = easeOutQuad(percentage)

        const currentCount = Math.floor(start + (end - start) * easedProgress)

        if (currentCount !== countRef.current) {
          countRef.current = currentCount
          setCount(currentCount)
        }

        if (percentage < 1) {
          rafRef.current = requestAnimationFrame(animate)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      if (timer) clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [start, end, duration, delay])

  return <span className={cn(className)}>{`${prefix}${count}${suffix}`}</span>
}
