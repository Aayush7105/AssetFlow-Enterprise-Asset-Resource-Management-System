"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, CalendarCheck } from "lucide-react"

export default function BookingsPage() {
  const [search, setSearch] = useState("")
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Bookings"
        description="Manage asset reservations and bookings"
        actions={
          <Button>
            <Plus className="size-4" />
            New Booking
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." className="max-w-sm" />
      </div>
      <EmptyState
        icon={CalendarCheck}
        title="No bookings"
        description="Resource booking requests will appear here."
      />
    </div>
  )
}
