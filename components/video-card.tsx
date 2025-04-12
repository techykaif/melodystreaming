"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, PlayCircle } from "lucide-react"
import type { VideoItem } from "@/types/youtube"
import { formatDuration } from "@/lib/utils"
import { useLikedSongs } from "@/hooks/use-liked-songs"

interface VideoCardProps {
  video: VideoItem
  onSelect: (video: VideoItem) => void
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const { isLiked, toggleLike } = useLikedSongs()
  const [isHovered, setIsHovered] = useState(false)
  const liked = isLiked(video.id)

  return (
    <motion.div whileHover={{ y: -5 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card className="overflow-hidden h-full">
        <div className="relative aspect-video">
          <Image src={video.thumbnail || "/placeholder.svg"} alt={video.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-background/80 hover:bg-background/90"
              onClick={() => onSelect(video)}
            >
              <PlayCircle className="h-8 w-8 text-primary" />
            </Button>
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2 mb-1">{video.title}</h3>
              <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`flex-shrink-0 ${liked ? "text-red-500" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleLike(video)
              }}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
