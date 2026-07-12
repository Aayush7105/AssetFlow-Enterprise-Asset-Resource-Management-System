"use client"

import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient()
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth.store"
import { useSettingsStore } from "@/stores/settings.store"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("assetflow_user")
      if (stored) {
        try {
          useAuthStore.getState().setUser(JSON.parse(stored))
        } catch (e) {
          console.error("Failed to parse stored user", e)
          useAuthStore.getState().setUser(null)
        }
      } else {
        useAuthStore.getState().setUser(null)
      }
      useSettingsStore.getState().loadSettings()
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  )
}

