"use server"

import type { VideoItem } from "@/types/youtube"

export async function searchVideos(query: string): Promise<VideoItem[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      throw new Error("YouTube API key is not defined")
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(
        query,
      )}&type=video&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch videos")
    }

    const data = await response.json()

    // Get video IDs for content details (duration)
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",")

    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`,
    )

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch video details")
    }

    const detailsData = await detailsResponse.json()

    // Map duration to each video
    const durationMap = new Map()
    detailsData.items.forEach((item: any) => {
      durationMap.set(item.id, item.contentDetails.duration)
    })

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: durationMap.get(item.id.videoId) || null,
    }))
  } catch (error) {
    console.error("Error searching videos:", error)
    return []
  }
}
