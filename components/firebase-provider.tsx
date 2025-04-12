"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

interface FirebaseContextType {
  db: any | null
  isInitialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  db: null,
  isInitialized: false,
})

export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<any | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      // Initialize Firebase - in a real app, these would be environment variables
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,}

      // Initialize Firebase
      const app = initializeApp(firebaseConfig)
      const database = getDatabase(app)

      setDb(database)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error initializing Firebase:", error)
      // Fallback to localStorage if Firebase fails
      setIsInitialized(true)
    }
  }, [])

  return <FirebaseContext.Provider value={{ db, isInitialized }}>{children}</FirebaseContext.Provider>
}

export const useFirebase = () => useContext(FirebaseContext)
