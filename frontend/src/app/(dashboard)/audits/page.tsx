"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, ClipboardCheck } from "lucide-react"

export default function AuditsPage() {
  const [search, setSearch] = useState("")
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audits"
        description="Schedule and manage asset audits"
        actions={
          <Button>
            <Plus className="size-4" />
            Schedule Audit
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search audits..." className="max-w-sm" />
      </div>
      <EmptyState
        icon={ClipboardCheck}
        title="No audits"
        description="Scheduled audits will appear here."
      />
    </div>
  )
}