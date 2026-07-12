"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ComboSelect } from "@/components/shared/combo-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, Allocation } from "@/stores/erp.store"
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
  ArrowRightLeft,
  Calendar,
  User,
  ClipboardList,
  RefreshCw,
  XCircle,
} from "lucide-react"

export default function AllocationsPage() {
  const { toast } = useToast()
  const { allocations, assets, employees, allocateAsset, returnAsset, transferAsset } = useERPStore()

  // Filters & State
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Form Modals
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isReturnOpen, setIsReturnOpen] = useState(false)

  // Selection
  const [activeAllocation, setActiveAllocation] = useState<Allocation | null>(null)

  // Forms
  const [allocForm, setAllocForm] = useState({
    assetId: "",
    employeeId: "",
    expectedReturnDate: "",
  })

  const [transferForm, setTransferForm] = useState({
    employeeId: "",
  })

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allocForm.assetId || !allocForm.employeeId) return
    const asset = assets.find((a) => a.id === allocForm.assetId)
    const emp = employees.find((em) => em.id === allocForm.employeeId)
    if (!asset || !emp) return

    allocateAsset({
      assetId: asset.id,
      assetName: asset.name,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      expectedReturnDate: allocForm.expectedReturnDate,
    })

    toast({ title: "Asset Allocated", description: `Assigned "${asset.name}" to ${emp.name}.` })
    setIsAllocateOpen(false)
    setAllocForm({ assetId: "", employeeId: "", expectedReturnDate: "" })
  }

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAllocation || !transferForm.employeeId) return
    const emp = employees.find((em) => em.id === transferForm.employeeId)
    if (!emp) return

    transferAsset(
      activeAllocation.id,
      emp.id,
      emp.name,
      emp.department
    )

    toast({ title: "Assignment Transferred", description: `Transferred "${activeAllocation.assetName}" to ${emp.name}.` })
    setIsTransferOpen(false)
    setTransferForm({ employeeId: "" })
    setActiveAllocation(null)
  }

  const handleReturnConfirm = () => {
    if (!activeAllocation) return
    returnAsset(activeAllocation.id)
    toast({ title: "Asset Returned", description: `"${activeAllocation.assetName}" returned to inventory.` })
    setIsReturnOpen(false)
    setActiveAllocation(null)
  }

  // Filter lists
  const filteredAllocations = allocations.filter((a) => {
    const matchesSearch =
      a.assetName.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage) || 1
  const paginatedAllocations = filteredAllocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusColors = {
    Active: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Returned: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Overdue: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Allocations"
        description="Track active assignments, expected returns, and history of asset movement"
        actions={
          <Button onClick={() => setIsAllocateOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Allocate Asset
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by asset, assignee or dept..." />
        </div>
        <ComboSelect
          options={[
            { value: "all", label: "All Allocations" },
            { value: "Active", label: "Active" },
            { value: "Returned", label: "Returned" },
            { value: "Overdue", label: "Overdue" },
          ]}
          value={statusFilter}
          onValueChange={setStatusFilter}
          placeholder="All Allocations"
          searchable={false}
          className="w-44 bg-card"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Asset Name</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Department</th>
                <th className="p-4 hidden sm:table-cell">Allocation Date</th>
                <th className="p-4 hidden md:table-cell">Expected Return</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAllocations.map((alloc) => (
                <tr key={alloc.id} className="border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors">
                  <td className="p-4 text-[13px] font-medium text-foreground">{alloc.assetName}</td>
                  <td className="p-4 text-[13px] text-foreground">{alloc.employeeName}</td>
                  <td className="p-4 text-[13px] text-muted-foreground">{alloc.department}</td>
                  <td className="p-4 text-[13px] text-muted-foreground hidden sm:table-cell">{alloc.allocationDate}</td>
                  <td className="p-4 text-[13px] text-muted-foreground hidden md:table-cell">{alloc.expectedReturnDate || "Permanent"}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`h-5 text-[10px] font-medium rounded-full ${statusColors[alloc.status]}`}>
                      {alloc.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1.5">
                    {alloc.status === "Active" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => { setActiveAllocation(alloc); setIsTransferOpen(true) }}
                          title="Transfer Assignment"
                        >
                          <ArrowRightLeft className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 hover:bg-accent text-muted-foreground hover:text-foreground"
                          onClick={() => { setActiveAllocation(alloc); setIsReturnOpen(true) }}
                          title="Return Asset"
                        >
                          <RefreshCw className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedAllocations.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                    No allocation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <p className="text-[12px] text-muted-foreground">
            Showing {paginatedAllocations.length} of {filteredAllocations.length} allocations
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <span className="text-[12px] text-muted-foreground px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* ALLOCATE ASSET DIALOG */}
      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Allocation Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAllocateSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Select Available Asset</label>
                <ComboSelect
                  options={assets
                    .filter((a) => a.status === "Available")
                    .map((a) => ({
                      value: a.id,
                      label: a.name,
                      description: a.assetTag,
                    }))}
                  value={allocForm.assetId}
                  onValueChange={(val) => setAllocForm({ ...allocForm, assetId: val })}
                  placeholder="Select Asset"
                  searchPlaceholder="Search available assets..."
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Assignee (Employee)</label>
                <ComboSelect
                  options={employees.map((emp) => ({
                    value: emp.id,
                    label: emp.name,
                    description: emp.department,
                  }))}
                  value={allocForm.employeeId}
                  onValueChange={(val) => setAllocForm({ ...allocForm, employeeId: val })}
                  placeholder="Select Employee"
                  searchPlaceholder="Search employees..."
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Expected Return Date</label>
                <input
                  type="date"
                  required
                  value={allocForm.expectedReturnDate}
                  onChange={(e) => setAllocForm({ ...allocForm, expectedReturnDate: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAllocateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Allocation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TRANSFER ASSET DIALOG */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Asset Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <span className="text-muted-foreground block mb-1">Asset Name</span>
                <p className="font-semibold text-sm">{activeAllocation?.assetName}</p>
                <span className="text-muted-foreground block mt-2 mb-1">Current Assignee</span>
                <p className="text-sm font-medium">{activeAllocation?.employeeName} ({activeAllocation?.department})</p>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Transfer to Employee</label>
                <ComboSelect
                  options={employees
                    .filter((e) => e.name !== activeAllocation?.employeeName)
                    .map((emp) => ({
                      value: emp.id,
                      label: emp.name,
                      description: emp.department,
                    }))}
                  value={transferForm.employeeId}
                  onValueChange={(val) => setTransferForm({ ...transferForm, employeeId: val })}
                  placeholder="Select Assignee"
                  searchPlaceholder="Search employees..."
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsTransferOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RETURN CONFIRM DIALOG */}
      <Dialog open={isReturnOpen} onOpenChange={setIsReturnOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Asset Return</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to process the return of <span className="font-semibold text-foreground">"{activeAllocation?.assetName}"</span> from <span className="font-semibold text-foreground">{activeAllocation?.employeeName}</span>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReturnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturnConfirm}>
              Return Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
