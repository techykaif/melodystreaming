import type React from "react"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import PlayerProvider from "@/components/player-provider"
import FirebaseProvider from "@/components/firebase-provider"
import Player from "@/components/player"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MelodyStream",
  description: "A modern music streaming platform",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
  ],
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#18181b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FirebaseProvider>
            <PlayerProvider>
              <div className="min-h-screen pb-24 md:pb-28">{children}</div>
              <Player />
            </PlayerProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'