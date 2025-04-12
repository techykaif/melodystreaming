"use client"

import { usePlayerContext } from "@/components/player-provider"

export function usePlayer() {
  return usePlayerContext()
}
