"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Shield, Key } from "lucide-react"

const rolesData = [
  {
    name: "Admin",
    description: "Full administrative access control to all system resources, settings, audit trails, and employee permissions.",
    permissions: ["Full Control (*)", "Manage Employees", "Manage Departments", "Manage Asset Categories", "View Logs", "Modify Roles"],
    color: "border-l-red-500",
  },
  {
    name: "Asset Manager",
    description: "Responsible for managing and registering assets, processing allocations, raising maintenance requests, and compiling reports.",
    permissions: ["Register Assets", "Edit Assets", "Allocate Assets", "Raise Maintenance", "Generate Inventory Reports", "Manage Audits"],
    color: "border-l-blue-500",
  },
  {
    name: "Department Head",
    description: "Department-level asset custody and request approval. Can approve or deny bookings and equipment assignments.",
    permissions: ["View Department Assets", "Approve Asset Requests", "Book Shared Resources", "Request Asset Maintenance", "Approve Bookings"],
    color: "border-l-amber-500",
  },
  {
    name: "Employee",
    description: "Standard end-user workspace permissions. Access allocated devices, book shared resources, and request device repairs.",
    permissions: ["View Personal Assets", "Book Resources", "Raise Personal Maintenance Tickets", "View Notifications"],
    color: "border-l-emerald-500",
  },
]

export default function RolesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Access Control Roles"
        description="Review enterprise access authorization matrix and user role permission mappings"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {rolesData.map((role) => (
          <div
            key={role.name}
            className={`border border-border/60 bg-card rounded-2xl p-5 shadow-none card-hover border-l-4 ${role.color} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Shield className="size-4" />
                </div>
                <h3 className="font-semibold text-sm text-foreground">{role.name}</h3>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
                {role.description}
              </p>
            </div>

            <div className="border-t border-border/40 pt-4 mt-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-2.5 flex items-center gap-1">
                <Key className="size-3" /> Enabled Permissions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.map((perm) => (
                  <Badge
                    key={perm}
                    variant="secondary"
                    className="h-5 px-2 text-[10px] font-normal rounded-md"
                  >
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
