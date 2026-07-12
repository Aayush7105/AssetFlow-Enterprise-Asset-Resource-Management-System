"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, AuditCycle } from "@/stores/erp.store"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus,
  ClipboardCheck,
  Calendar,
  User,
  Shield,
  Layers,
} from "lucide-react"

export default function AuditsPage() {
  const { toast } = useToast()
  const { audits, addAuditCycle, updateAuditStatus, employees, departments } = useERPStore()

  // State
  const [search, setSearch] = useState("")
  const [isCycleOpen, setIsCycleOpen] = useState(false)

  // Forms
  const [auditForm, setAuditForm] = useState({
    name: "",
    scope: "Full Company",
    department: "",
    auditor: "",
    startDate: "",
    endDate: "",
  })

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auditForm.name || !auditForm.auditor || !auditForm.department) return

    addAuditCycle(auditForm)
    toast({ title: "Audit Created", description: `Successfully scheduled audit cycle "${auditForm.name}".` })
    setIsCycleOpen(false)
    setAuditForm({ name: "", scope: "Full Company", department: "", auditor: "", startDate: "", endDate: "" })
  }

  const handleStatusChange = (id: string, status: AuditCycle["status"]) => {
    updateAuditStatus(id, status)
    toast({ title: "Audit Updated", description: `Updated status to "${status}".` })
  }

  // Filter list
  const filteredAudits = audits.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.auditor.toLowerCase().includes(search.toLowerCase()) ||
    a.department.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors = {
    Scheduled: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "In Progress": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Cancelled: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Audits"
        description="Schedule periodic asset verifications, assign auditors, and track audit compliance cycles"
        actions={
          <Button onClick={() => setIsCycleOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Schedule Audit
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search audit cycles..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAudits.map((audit) => (
          <div
            key={audit.id}
            className="rounded-2xl border border-border/60 bg-card p-5 shadow-none card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <ClipboardCheck className="size-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground truncate max-w-[150px]">{audit.name}</h3>
                </div>
                <Badge variant="outline" className={`h-5 text-[10px] font-medium rounded-full ${statusColors[audit.status]}`}>
                  {audit.status}
                </Badge>
              </div>

              <div className="space-y-2.5 text-[13px] text-muted-foreground mb-5">
                <div className="flex items-center gap-2">
                  <Layers className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>Scope: <span className="font-medium text-foreground">{audit.scope}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>Auditor: <span className="font-medium text-foreground">{audit.auditor}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{audit.startDate} to {audit.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>Dept: <span className="font-medium text-foreground">{audit.department}</span></span>
                </div>
              </div>
            </div>

            {audit.status !== "Completed" && audit.status !== "Cancelled" && (
              <div className="flex items-center gap-1.5 border-t border-border/40 pt-3.5">
                {audit.status === "Scheduled" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(audit.id, "In Progress")}
                    className="h-8 text-xs flex-1 text-blue-600 hover:bg-blue-500/5"
                  >
                    Start Audit
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(audit.id, "Completed")}
                    className="h-8 text-xs flex-1 text-emerald-600 hover:bg-emerald-500/5"
                  >
                    Mark Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(audit.id, "Cancelled")}
                  className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/5"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))}
        {filteredAudits.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No audits scheduled yet. Click "Schedule Audit" to create one.
          </div>
        )}
      </div>

      {/* CREATE AUDIT CYCLE DIALOG */}
      <Dialog open={isCycleOpen} onOpenChange={setIsCycleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Audit Cycle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuditSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  value={auditForm.name}
                  onChange={(e) => setAuditForm({ ...auditForm, name: e.target.value })}
                  placeholder="e.g. Q4 Verification"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Scope</label>
                  <select
                    value={auditForm.scope}
                    onChange={(e) => setAuditForm({ ...auditForm, scope: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="Full Company">Full Company</option>
                    <option value="Department Only">Department Only</option>
                    <option value="High Value Assets">High Value Assets</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Auditor</label>
                  <select
                    required
                    value={auditForm.auditor}
                    onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select Auditor</option>
                    {employees.filter((emp) => emp.role === "auditor" || emp.role === "admin").map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Department</label>
                <select
                  required
                  value={auditForm.department}
                  onChange={(e) => setAuditForm({ ...auditForm, department: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select Department</option>
                  <option value="All Departments">All Departments</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={auditForm.startDate}
                    onChange={(e) => setAuditForm({ ...auditForm, startDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={auditForm.endDate}
                    onChange={(e) => setAuditForm({ ...auditForm, endDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCycleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Schedule Cycle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
