"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, Wrench } from "lucide-react"

export default function MaintenancePage() {
  const [search, setSearch] = useState("")
  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Track and manage asset maintenance requests"
        actions={
          <Button>
            <Plus className="size-4" />
            New Request
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search maintenance..." className="max-w-sm" />
      </div>
      <EmptyState
        icon={Wrench}
        title="No maintenance requests"
        description="Maintenance requests will appear here once created."
      />
    </div>
  )
}