"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "@/components/firebase-provider"
import { ref, set, remove, onValue } from "firebase/database"
import type { VideoItem } from "@/types/youtube"

export function useLikedSongs() {
  const [likedSongs, setLikedSongs] = useState<VideoItem[]>([])
  const { db, isInitialized } = useFirebase()

  // Load liked songs from localStorage on mount
  useEffect(() => {
    if (!isInitialized) return

    try {
      // Try to load from localStorage first (fallback)
      const storedLikedSongs = localStorage.getItem("likedSongs")
      if (storedLikedSongs) {
        setLikedSongs(JSON.parse(storedLikedSongs))
      }

      // If Firebase is available, sync with it
      if (db) {
        const likedSongsRef = ref(db, "likedSongs")
        onValue(likedSongsRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            const songsArray = Object.values(data) as VideoItem[]
            setLikedSongs(songsArray)
            // Update localStorage as backup
            localStorage.setItem("likedSongs", JSON.stringify(songsArray))
          }
        })
      }
    } catch (error) {
      console.error("Error loading liked songs:", error)
    }
  }, [db, isInitialized])

  const isLiked = (videoId: string) => {
    return likedSongs.some((song) => song.id === videoId)
  }

  const toggleLike = (video: VideoItem) => {
    try {
      if (isLiked(video.id)) {
        // Remove from liked songs
        const updatedLikedSongs = likedSongs.filter((song) => song.id !== video.id)
        setLikedSongs(updatedLikedSongs)

        // Update localStorage
        localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs))

        // Update Firebase if available
        if (db) {
          remove(ref(db, `likedSongs/${video.id}`))
        }
      } else {
        // Add to liked songs
        const updatedLikedSongs = [...likedSongs, video]
        setLikedSongs(updatedLikedSongs)

        // Update localStorage
        localStorage.setItem("likedSongs", JSON.stringify(updatedLikedSongs))

        // Update Firebase if available
        if (db) {
          set(ref(db, `likedSongs/${video.id}`), video)
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const clearLikedSongs = () => {
    try {
      // Clear state
      setLikedSongs([])

      // Clear localStorage
      localStorage.removeItem("likedSongs")

      // Clear Firebase if available
      if (db) {
        remove(ref(db, "likedSongs"))
      }
    } catch (error) {
      console.error("Error clearing liked songs:", error)
    }
  }

  return {
    likedSongs,
    isLiked,
    toggleLike,
    clearLikedSongs,
  }
}
