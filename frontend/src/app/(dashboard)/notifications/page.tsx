import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with the latest activity"
        actions={
          <Button variant="outline" size="sm">
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        }
      />
      <EmptyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up! Notifications will appear here."
      />
    </div>
  )
}