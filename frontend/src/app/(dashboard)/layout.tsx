"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { useERPStore } from "@/stores/erp.store"
import { useAuthStore } from "@/stores/auth.store"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrateFromBackend = useERPStore((state) => state.hydrateFromBackend)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const router = useRouter()

  useEffect(() => {
    // Dismiss the fullscreen loader once the dashboard layout has successfully mounted
    useAuthStore.getState().setAuthenticating(false)

    hydrateFromBackend().catch((error) => {
      console.warn("Could not hydrate ERP data from backend:", error)
    })
  }, [hydrateFromBackend])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN)
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppNavbar />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
