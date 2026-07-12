"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"

export default function AssetsPage() {
  const [search, setSearch] = useState("")
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Manage your organization's assets"
        actions={
          <Button>
            <Plus className="size-4" />
            Add Asset
          </Button>
        }
      />
      <div className="flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search assets..." className="max-w-sm" />
      </div>
      <EmptyState
        icon={Package}
        title="No assets yet"
        description="Start by adding your first asset to the system."
        action={
          <Button variant="outline">
            <Plus className="size-4" />
            Add Asset
          </Button>
        }
      />
    </div>
  )
}
