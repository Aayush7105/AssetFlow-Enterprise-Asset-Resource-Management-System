import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view analytical reports"
      />
      <EmptyState
        icon={BarChart3}
        title="No reports generated"
        description="Generate your first report to see analytics and insights."
      />
    </div>
  )
}
