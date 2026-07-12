"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const messages = [
  "Preparing your workspace...",
  "Loading your organization...",
  "Syncing your preferences...",
  "Almost ready...",
]

export function AuthLoader() {
  const [dots, setDots] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)

  // Cycle dots: "", ".", "..", "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Rotate status messages every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090B] text-zinc-100 selection:bg-zinc-800"
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center select-none">
        {/* Animated Cube/Box Logo */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            scale: [1, 1.04, 1],
            opacity: [0.85, 1, 0.85],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex size-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800/80 text-zinc-100 shadow-2xl shadow-black/80"
        >
          <svg
            className="size-8 text-zinc-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </motion.div>

        {/* Primary Loading Text */}
        <h2 className="mt-8 text-[15px] font-medium tracking-wide text-zinc-200 w-48 text-left pl-8">
          Signing you in<span className="inline-block w-6 text-left">{dots}</span>
        </h2>

        {/* Rotating Subtext */}
        <div className="h-6 mt-2 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messages[messageIndex]}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 0.5, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-xs text-zinc-400 font-medium tracking-normal"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
