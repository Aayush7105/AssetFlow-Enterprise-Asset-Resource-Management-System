"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightLeft } from "lucide-react"

export default function AllocationsPage() {
  const [search, setSearch] = useState("")
  return (
    <div className="space-y-6">
      <PageHeader
        title="Allocations"
        description="Track asset assignments and returns"
        actions={
          <Button>
            <Plus className="size-4" />
            New Allocation
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search allocations..." className="max-w-sm" />
      </div>
      <EmptyState
        icon={ArrowRightLeft}
        title="No allocations"
        description="Asset allocation records will appear here."
      />
    </div>
  )
}