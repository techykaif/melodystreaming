import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(duration: string): string {
  // Convert ISO 8601 duration to seconds
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  const totalMinutes = hours * 60 + minutes

  if (totalMinutes === 0) {
    return `0:${seconds.toString().padStart(2, "0")}`
  } else {
    return `${totalMinutes}:${seconds.toString().padStart(2, "0")}`
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}
