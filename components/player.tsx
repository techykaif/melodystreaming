"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import YouTube from "react-youtube"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, Heart, X } from "lucide-react"
import { usePlayer } from "@/hooks/use-player"
import { useLikedSongs } from "@/hooks/use-liked-songs"
import { formatTime } from "@/lib/utils"

export default function Player() {
  const { currentVideo, setCurrentVideo } = usePlayer()
  const { isLiked, toggleLike } = useLikedSongs()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(100)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleReady = (event: any) => {
    playerRef.current = event.target
    setIsReady(true)
    setDuration(playerRef.current.getDuration())

    // Start time tracking
    intervalRef.current = setInterval(() => {
      setCurrentTime(playerRef.current.getCurrentTime())
    }, 1000)

    // Auto play
    playerRef.current.playVideo()
  }

  const handleStateChange = (event: any) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    setIsPlaying(event.data === 1)

    if (event.data === 0) {
      // Video ended
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
      playerRef.current.setVolume(volume)
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current) return

    const newVolume = value[0]
    setVolume(newVolume)
    playerRef.current.setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
      playerRef.current.mute()
    } else if (isMuted) {
      setIsMuted(false)
      playerRef.current.unMute()
    }
  }

  const handleTimeChange = (value: number[]) => {
    if (!playerRef.current) return

    const newTime = value[0]
    setCurrentTime(newTime)
    playerRef.current.seekTo(newTime)
  }

  const handleClose = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo()
    }
    setCurrentVideo(null)
    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setIsExpanded(false)
  }

  const liked = currentVideo ? isLiked(currentVideo.id) : false

  if (!currentVideo) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed bottom-0 left-0 right-0 glassmorphism border-t z-50 ${
          isExpanded ? "h-screen" : "h-24 md:h-28"
        }`}
      >
        {isExpanded ? (
          <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Now Playing</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                <Minimize2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-3xl aspect-video">
                <YouTube
                  videoId={currentVideo.id}
                  opts={{
                    height: "100%",
                    width: "100%",
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      disablekb: 1,
                      fs: 0,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                  onReady={handleReady}
                  onStateChange={handleStateChange}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold mb-1">{currentVideo.title}</h2>
              <p className="text-muted-foreground mb-4">{currentVideo.channelTitle}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration}
                    step={1}
                    onValueChange={handleTimeChange}
                    className="flex-1"
                  />
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleLike(currentVideo)}>
                      <Heart className={`h-5 w-5 ${liked ? "fill-current text-red-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleClose}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <SkipBack className="h-6 w-6" />
                  </Button>
                  <Button variant="default" size="icon" className="h-14 w-14 rounded-full" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-between px-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {isReady && (
                <div className="hidden md:block h-16 w-16 relative flex-shrink-0">
                  <img
                    src={currentVideo.thumbnail || "/placeholder.svg"}
                    alt={currentVideo.title}
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm md:text-base truncate">{currentVideo.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{currentVideo.channelTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={togglePlay} className="h-10 w-10">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toggleLike(currentVideo)} className="h-10 w-10">
                <Heart className={`h-5 w-5 ${liked ? "fill-current text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} className="h-10 w-10">
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {!isExpanded && (
          <div className="absolute -top-2 left-0 right-0 h-2">
            <div className="bg-primary h-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
          </div>
        )}

        {/* Hidden YouTube player when minimized */}
        {!isExpanded && (
          <div className="hidden">
            <YouTube
              videoId={currentVideo.id}
              opts={{
                height: "1",
                width: "1",
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                },
              }}
              onReady={handleReady}
              onStateChange={handleStateChange}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
