"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MusicIcon, HomeIcon, SearchIcon, Trash2 } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import { useLikedSongs } from "@/hooks/use-liked-songs"
import { usePlayer } from "@/hooks/use-player"
import VideoCard from "./video-card"
import type { VideoItem } from "@/types/youtube"

export default function LikedSongs() {
  const { likedSongs, clearLikedSongs } = useLikedSongs()
  const { setCurrentVideo } = usePlayer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleVideoSelect = (video: VideoItem) => {
    setCurrentVideo(video)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center glassmorphism sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <HomeIcon className="h-5 w-5" />
            </Button>
          </Link>
          <MusicIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">MelodyStream</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <h1 className="text-3xl font-bold">Liked Songs</h1>
          {likedSongs.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearLikedSongs}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {likedSongs.length > 0 ? (
            <motion.div
              key="liked-songs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {likedSongs.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <VideoCard video={video} onSelect={handleVideoSelect} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-liked-songs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <MusicIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">You haven't liked any songs yet</p>
              <Link href="/search">
                <Button>
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search for Music
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
