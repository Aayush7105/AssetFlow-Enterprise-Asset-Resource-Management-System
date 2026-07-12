"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppNavbar } from "@/components/layout/app-navbar"
import { useERPStore } from "@/stores/erp.store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrateFromBackend = useERPStore((state) => state.hydrateFromBackend)

  useEffect(() => {
    hydrateFromBackend().catch((error) => {
      console.warn("Could not hydrate ERP data from backend:", error)
    })
  }, [hydrateFromBackend])

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
