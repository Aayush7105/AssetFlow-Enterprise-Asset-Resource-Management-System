"use client"

import { PageHeader } from "@/components/shared/page-header"
import { StatsCard } from "@/components/shared/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useERPStore } from "@/stores/erp.store"
import {
  Package,
  ArrowRightLeft,
  Users,
  AlertTriangle,
  CalendarCheck,
  ClipboardCheck,
  Wrench,
} from "lucide-react"

export default function DashboardPage() {
  const { assets, employees, bookings, maintenance, activities, departments } = useERPStore()

  // Calculate real metrics
  const totalAssets = assets.length
  const allocatedAssets = assets.filter((a) => a.status === "Allocated").length
  const totalEmployees = employees.length
  const underMaintenance = assets.filter((a) => a.status === "Under Maintenance").length

  // Asset conditions count
  const availableCount = assets.filter((a) => a.status === "Available").length
  const allocatedCount = assets.filter((a) => a.status === "Allocated").length
  const maintenanceCount = assets.filter((a) => a.status === "Under Maintenance").length
  const disposedCount = assets.filter((a) => a.status === "Disposed").length

  return (
    <div className="space-y-5">
      <PageHeader
        title="Dashboard"
        description="Overview of your asset management system"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={totalAssets.toString()}
          icon={Package}
          change={{ value: 12, trend: "up" }}
          sparkline={[30, 35, 28, 42, 38, 50, totalAssets]}
          lastUpdated="Updated just now"
        />
        <StatsCard
          title="Allocated"
          value={allocatedAssets.toString()}
          icon={ArrowRightLeft}
          change={{ value: 5, trend: "up" }}
          sparkline={[20, 22, 25, 23, 28, 30, allocatedAssets]}
          lastUpdated="Updated just now"
        />
        <StatsCard
          title="Employees"
          value={totalEmployees.toString()}
          icon={Users}
          change={{ value: 3, trend: "neutral" }}
          sparkline={[15, 15, 16, 15, 16, 16, totalEmployees]}
          lastUpdated="Updated just now"
        />
        <StatsCard
          title="Maintenance"
          value={underMaintenance.toString()}
          icon={AlertTriangle}
          change={{ value: 8, trend: "down" }}
          sparkline={[35, 30, 28, 32, 25, 22, underMaintenance]}
          lastUpdated="Updated just now"
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border/60" />
              <div className="space-y-0">
                {activities.slice(0, 5).map((item, i) => (
                  <div key={i} className="relative flex items-start gap-3 py-2.5 pl-0">
                    <div className="relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background">
                      {item.initials}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-[13px] text-foreground leading-snug">
                        <span className="font-medium">{item.initials}</span>
                        {" "}{item.action}{" "}
                        <span className="font-medium">{item.entity}</span>
                        {item.target && (
                          <> to <span className="font-medium">{item.target}</span></>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal rounded-md">
                          {item.department}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground/60">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="space-y-2">
              {[
                { title: "Q4 Asset Verification", type: "Audit", date: "Dec 15", department: "All Departments", priority: "high" as const, status: "Scheduled" },
                { title: "Server Room Maintenance", type: "Maintenance", date: "Dec 12", department: "IT Support", priority: "medium" as const, status: "Confirmed" },
              ].map((event, i) => (
                <div
                  key={i}
                  className="relative flex gap-3 rounded-xl border border-border/40 bg-muted/20 p-3 hover:bg-muted/40 transition-colors duration-150"
                >
                  <div className="w-0.5 self-stretch rounded-full bg-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium leading-snug truncate">{event.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal rounded-md border-border/60">
                        {event.type}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{event.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted-foreground/70">{event.department}</span>
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal rounded-md">
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-medium">Asset Status</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="space-y-3">
              {[
                { label: "Available", count: availableCount, total: totalAssets || 1, color: "bg-emerald-500" },
                { label: "Allocated", count: allocatedCount, total: totalAssets || 1, color: "bg-blue-500" },
                { label: "Maintenance", count: maintenanceCount, total: totalAssets || 1, color: "bg-amber-500" },
                { label: "Disposed", count: disposedCount, total: totalAssets || 1, color: "bg-red-500/60" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-muted-foreground">{item.label}</span>
                    <span className="text-[13px] font-medium">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-medium">Maintenance Queue</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="space-y-2">
              {maintenance.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <Wrench className="size-3.5 text-muted-foreground/50 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{item.assetName}</p>
                    <p className="text-[11px] text-muted-foreground">{item.description} · {item.createdAt}</p>
                  </div>
                  <Badge
                    variant={item.priority === "High" ? "destructive" : "secondary"}
                    className="h-5 px-1.5 text-[10px] font-normal rounded-md shrink-0"
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
              {maintenance.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No maintenance requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-5 pt-5 pb-0">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="space-y-2.5">
              {departments.slice(0, 5).map((dept) => {
                const deptAssets = assets.filter((a) => a.department === dept.name).length
                const deptEmployees = employees.filter((e) => e.department === dept.name).length
                return (
                  <div key={dept.name} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-[13px] font-medium">{dept.name}</p>
                      <p className="text-[11px] text-muted-foreground">{deptEmployees} people</p>
                    </div>
                    <span className="text-[13px] text-muted-foreground tabular-nums">{deptAssets} assets</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Allocations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Asset</th>
                    <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Assignee</th>
                    <th className="pb-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 hidden sm:table-cell">Department</th>
                    <th className="pb-2 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.filter((a) => a.status === "Allocated").slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-border/20 last:border-0 hover:bg-accent/30 transition-colors">
                      <td className="py-2.5 text-[13px] font-medium">{row.name}</td>
                      <td className="py-2.5 text-[13px] text-muted-foreground">{row.assignedEmployee}</td>
                      <td className="py-2.5 text-[13px] text-muted-foreground hidden sm:table-cell">{row.department}</td>
                      <td className="py-2.5 text-right">
                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal rounded-md">
                          Allocated
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {assets.filter((a) => a.status === "Allocated").length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-sm text-muted-foreground py-4 text-center">No allocated assets</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Bookings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-5 py-4">
            <div className="space-y-2">
              {bookings.slice(0, 4).map((booking, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/30 p-3 hover:bg-accent/20 transition-colors duration-150">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <CalendarCheck className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{booking.resource}</p>
                    <p className="text-[11px] text-muted-foreground">{booking.purpose} · {booking.date} at {booking.startTime}</p>
                  </div>
                  <Badge
                    variant={booking.status === "Approved" ? "secondary" : "outline"}
                    className="h-5 px-1.5 text-[10px] font-normal rounded-md shrink-0"
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
              {bookings.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
