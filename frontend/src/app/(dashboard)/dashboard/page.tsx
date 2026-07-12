import { PageHeader } from "@/components/shared/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ArrowRightLeft, Users, AlertTriangle, CalendarCheck, ClipboardCheck } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your asset management system"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Assets" value="1,247" icon={Package} change={{ value: 12, trend: "up" }} />
        <StatsCard title="Allocated" value="856" icon={ArrowRightLeft} change={{ value: 5, trend: "up" }} />
        <StatsCard title="Employees" value="189" icon={Users} change={{ value: 3, trend: "neutral" }} />
        <StatsCard title="Maintenance" value="79" icon={AlertTriangle} change={{ value: 8, trend: "down" }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Asset LAP-001 allocated to John Doe", "Maintenance request for PRN-045 completed", "New employee Sarah added to Engineering"].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground flex-1">{activity}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{i + 1}h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Audit - Q4 Asset Verification", icon: ClipboardCheck, date: "Dec 15" },
                { title: "Booking - Conference Room A", icon: CalendarCheck, date: "Dec 10" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}