"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MusicIcon, SearchIcon, HeartIcon } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center glassmorphism sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <MusicIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">MelodyStream</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <SearchIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/liked">
            <Button variant="ghost" size="icon">
              <HeartIcon className="h-5 w-5" />
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-gradient">
              <MusicIcon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              MelodyStream
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Your modern music streaming experience</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push("/search")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Music
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/liked")}>
              <HeartIcon className="mr-2 h-5 w-5" />
              Liked Songs
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              className="glassmorphism p-6 rounded-xl"
            >
              <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}

const features = [
  {
    title: "Search & Stream",
    description: "Search for your favorite songs and stream them instantly from YouTube.",
    icon: <SearchIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: "Save Favorites",
    description: "Like and bookmark your favorite songs for quick access anytime.",
    icon: <HeartIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: "Install & Go Offline",
    description: "Install as a PWA and enjoy basic features even when offline.",
    icon: <MusicIcon className="h-6 w-6 text-primary" />,
  },
]
