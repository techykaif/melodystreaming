"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MusicIcon, SearchIcon, HomeIcon, HeartIcon, Loader2 } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"
import { searchVideos } from "@/lib/youtube"
import type { VideoItem } from "@/types/youtube"
import VideoCard from "./video-card"
import { usePlayer } from "@/hooks/use-player"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setCurrentVideo } = usePlayer()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const data = await searchVideos(query)
      setResults(data)
    } catch (error) {
      console.error("Error searching videos:", error)
    } finally {
      setLoading(false)
    }
  }

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
          <Link href="/liked">
            <Button variant="ghost" size="icon">
              <HeartIcon className="h-5 w-5" />
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-6">Search Music</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for songs, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SearchIcon className="h-4 w-4" />}
              <span className="ml-2 hidden md:inline">Search</span>
            </Button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="music-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {results.map((video, index) => (
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
          ) : query && !loading ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Search for your favorite music</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
