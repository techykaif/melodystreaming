"use client"

import { createContext, useState, useContext, type ReactNode } from "react"
import type { VideoItem } from "@/types/youtube"

interface PlayerContextType {
  currentVideo: VideoItem | null
  setCurrentVideo: (video: VideoItem | null) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null)

  return <PlayerContext.Provider value={{ currentVideo, setCurrentVideo }}>{children}</PlayerContext.Provider>
}

export const usePlayerContext = () => {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error("usePlayerContext must be used within a PlayerProvider")
  }
  return context
}
