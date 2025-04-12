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
        apiKey: "AIzaSyA4r1avTve-yVvn8qLFdpTHpKGNX9R7SJ4",
  authDomain: "melody-stream-b77a5.firebaseapp.com",
  projectId: "melody-stream-b77a5",
  storageBucket: "melody-stream-b77a5.firebasestorage.app",
  messagingSenderId: "199469545554",
  appId: "1:199469545554:web:6decca2aa7ea7355c1478b",}

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
