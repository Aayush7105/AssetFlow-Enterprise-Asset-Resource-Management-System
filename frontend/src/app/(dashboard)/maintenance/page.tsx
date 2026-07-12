"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ComboSelect } from "@/components/shared/combo-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, MaintenanceRequest } from "@/stores/erp.store"
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
  Wrench,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
} from "lucide-react"

export default function MaintenancePage() {
  const { toast } = useToast()
  const { maintenance, assets, addMaintenanceRequest, updateMaintenanceStatus } = useERPStore()

  // State
  const [search, setSearch] = useState("")
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null)

  // Forms
  const [reqForm, setReqForm] = useState({
    assetId: "",
    assetName: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
  })

  const [techForm, setTechForm] = useState({
    technician: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")
      const searchParam = params.get("search")

      if (action === "request") {
        setReqForm({ assetId: "", assetName: "", description: "", priority: "Medium" })
        setIsRequestOpen(true)
      } else if (searchParam) {
        setSearch(searchParam)
      }
    }
  }, [])

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reqForm.assetId || !reqForm.description) return
    const asset = assets.find((a) => a.id === reqForm.assetId)
    if (!asset) return

    addMaintenanceRequest({
      assetId: asset.id,
      assetName: asset.name,
      description: reqForm.description,
      priority: reqForm.priority,
    })

    toast({ title: "Request Submitted", description: `Submitted maintenance request for "${asset.name}".` })
    setIsRequestOpen(false)
    setReqForm({ assetId: "", assetName: "", description: "", priority: "Medium" })
  }

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeRequest || !techForm.technician) return

    updateMaintenanceStatus(activeRequest.id, "In Progress", techForm.technician)
    toast({ title: "Technician Assigned", description: `Assigned ${techForm.technician} to task.` })
    setIsAssignOpen(false)
    setTechForm({ technician: "" })
    setActiveRequest(null)
  }

  // Filter list
  const filteredMaintenance = maintenance.filter((m) =>
    m.assetName.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase()) ||
    m.technician.toLowerCase().includes(search.toLowerCase())
  )

  // Kanban Columns
  const columns = [
    { title: "Pending Request", status: "Pending" as const, color: "border-t-amber-500 bg-amber-500/5 text-amber-600" },
    { title: "Approved", status: "Approved" as const, color: "border-t-blue-500 bg-blue-500/5 text-blue-600" },
    { title: "In Progress", status: "In Progress" as const, color: "border-t-purple-500 bg-purple-500/5 text-purple-600" },
    { title: "Resolved", status: "Resolved" as const, color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-600" },
    { title: "Rejected", status: "Rejected" as const, color: "border-t-red-500 bg-red-500/5 text-red-600" },
  ]

  const priorityColors = {
    High: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Maintenance Log"
        description="Raise repair requests, assign technicians, and track resolution progress on the Kanban board"
        actions={
          <Button onClick={() => setIsRequestOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            New Request
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tickets..." />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5 h-[calc(100vh-220px)] overflow-x-auto min-h-[500px]">
        {columns.map((col) => {
          const colItems = filteredMaintenance.filter((m) => m.status === col.status)
          return (
            <div key={col.status} className="flex flex-col border border-border/60 rounded-2xl bg-card p-3 min-w-[200px] h-full overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{col.title}</span>
                <Badge variant="secondary" className="h-5 px-1.5 rounded-md text-[10px]">{colItems.length}</Badge>
              </div>

              <div className="space-y-2 flex-1">
                {colItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border/50 rounded-xl p-3.5 bg-muted/15 space-y-3 hover:bg-muted/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-[13px] text-foreground truncate max-w-[120px]">{item.assetName}</span>
                        <Badge variant="outline" className={`h-4 text-[9px] px-1 font-normal rounded-md ${priorityColors[item.priority]}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                      {item.technician ? (
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <User className="size-3" />
                          <span className="truncate">{item.technician}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/40 italic">No Tech Assigned</span>
                      )}

                      {/* Control buttons inside card */}
                      <div className="flex items-center gap-1">
                        {item.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                updateMaintenanceStatus(item.id, "Approved")
                                toast({ title: "Request Approved", description: `Approved maintenance request for "${item.assetName}".` })
                              }}
                              className="flex items-center justify-center p-1 rounded-md hover:bg-emerald-500/10 text-emerald-600 hover:text-emerald-700 flex-1 border border-border/40"
                              title="Approve"
                            >
                              <CheckCircle className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateMaintenanceStatus(item.id, "Rejected")
                                toast({ title: "Request Rejected", description: `Rejected maintenance request for "${item.assetName}".` })
                              }}
                              className="flex items-center justify-center p-1 rounded-md hover:bg-red-500/10 text-red-600 hover:text-red-700 flex-1 border border-border/40"
                              title="Reject"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          </>
                        )}

                        {item.status === "Approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] flex-1 text-purple-600 border-purple-500/20 hover:bg-purple-500/5"
                            onClick={() => { setActiveRequest(item); setIsAssignOpen(true) }}
                          >
                            Assign Tech
                          </Button>
                        )}

                        {item.status === "In Progress" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] flex-1 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/5"
                            onClick={() => {
                              updateMaintenanceStatus(item.id, "Resolved")
                              toast({ title: "Request Resolved", description: `Marked "${item.assetName}" as repaired.` })
                            }}
                          >
                            Resolve Task
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {colItems.length === 0 && (
                  <div className="py-8 text-center text-[11px] text-muted-foreground/40 italic">
                    Column empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* NEW REQUEST DIALOG */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Raise Maintenance Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Select Asset</label>
                <ComboSelect
                  options={assets.map((a) => ({ value: a.id, label: a.name, description: a.assetTag }))}
                  value={reqForm.assetId}
                  onValueChange={(val) => {
                    const asset = assets.find((a) => a.id === val)
                    setReqForm({ ...reqForm, assetId: val, assetName: asset?.name || "" })
                  }}
                  placeholder="Select Asset"
                  searchPlaceholder="Search assets..."
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Problem Description</label>
                <textarea
                  required
                  rows={3}
                  value={reqForm.description}
                  onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })}
                  placeholder="What is wrong with this resource?"
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Priority</label>
                <ComboSelect
                  options={[
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" },
                  ]}
                  value={reqForm.priority}
                  onValueChange={(val) => setReqForm({ ...reqForm, priority: val as any })}
                  placeholder="Select Priority"
                  searchable={false}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRequestOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSIGN TECH DIALOG */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Technician Name</label>
                <input
                  type="text"
                  required
                  value={techForm.technician}
                  onChange={(e) => setTechForm({ technician: e.target.value })}
                  placeholder="e.g. John Doe (IT)"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Start Maintenance
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
