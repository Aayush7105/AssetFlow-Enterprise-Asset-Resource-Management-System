"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ComboSelect } from "@/components/shared/combo-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, Asset } from "@/stores/erp.store"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Package,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Wrench,
  UserCheck,
  Tag,
  Hash,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
} from "lucide-react"

export default function AssetsPage() {
  const { toast } = useToast()
  const { assets, employees, departments, categories, addAsset, updateAsset, deleteAsset, allocateAsset, addMaintenanceRequest, transferAsset } = useERPStore()

  // Table state
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortField, setSortField] = useState<keyof Asset>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const itemsPerPage = 5

  // Modals & Drawers state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  // Current active asset state
  const [activeAsset, setActiveAsset] = useState<Asset | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    serialNumber: "",
    department: "",
    assignedEmployee: "",
    location: "",
    purchaseDate: "",
    condition: "NEW" as Asset["condition"],
    status: "Available" as Asset["status"],
    sharedResource: false,
  })

  const [allocationForm, setAllocationForm] = useState({
    employeeId: "",
    expectedReturnDate: "",
  })

  const [maintenanceForm, setMaintenanceForm] = useState({
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
  })

  const [transferForm, setTransferForm] = useState({
    employeeId: "",
  })

  // Handlers
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const assetId = params.get("id")
      const action = params.get("action")
      
      if (assetId) {
        const found = assets.find((a) => a.id === assetId)
        if (found) {
          setActiveAsset(found)
          setIsViewOpen(true)
        }
      } else if (action === "register") {
        resetFormData()
        setIsRegisterOpen(true)
      }
    }
  }, [assets])
  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageItemIds = paginatedAssets.map((a) => a.id)
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageItemIds])))
    } else {
      const pageItemIds = paginatedAssets.map((a) => a.id)
      setSelectedIds((prev) => prev.filter((id) => !pageItemIds.includes(id)))
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteAsset(id))
    toast({
      title: "Assets Deleted",
      description: `Successfully deleted ${selectedIds.length} assets.`,
    })
    setSelectedIds([])
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.category) {
      toast({ title: "Validation Error", description: "Name and Category are required.", variant: "destructive" })
      return
    }
    addAsset({
      ...formData,
      assignedEmployee: formData.status === "Allocated" ? formData.assignedEmployee : "",
      department: formData.status === "Allocated" ? formData.department : "",
    })
    toast({ title: "Asset Created", description: `"${formData.name}" has been registered successfully.` })
    setIsRegisterOpen(false)
    resetFormData()
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAsset) return
    updateAsset(activeAsset.id, formData)
    toast({ title: "Asset Updated", description: `"${formData.name}" has been updated successfully.` })
    setIsEditOpen(false)
    setActiveAsset(null)
    resetFormData()
  }

  const handleDeleteConfirm = () => {
    if (!activeAsset) return
    deleteAsset(activeAsset.id)
    toast({ title: "Asset Deleted", description: `"${activeAsset.name}" was successfully removed.` })
    setIsDeleteOpen(false)
    setActiveAsset(null)
  }

  const handleAllocateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAsset || !allocationForm.employeeId) return
    const emp = employees.find((e) => e.id === allocationForm.employeeId)
    if (!emp) return

    allocateAsset({
      assetId: activeAsset.id,
      assetName: activeAsset.name,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      expectedReturnDate: allocationForm.expectedReturnDate,
    })

    toast({ title: "Asset Allocated", description: `Allocated "${activeAsset.name}" to ${emp.name}.` })
    setIsAllocateOpen(false)
    setAllocationForm({ employeeId: "", expectedReturnDate: "" })
  }

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAsset || !transferForm.employeeId) return
    const emp = employees.find((e) => e.id === transferForm.employeeId)
    if (!emp) return

    // Find the allocation ID for this asset
    const allocation = useERPStore.getState().allocations.find((a) => a.assetId === activeAsset.id && a.status === "Active")
    if (allocation) {
      transferAsset(allocation.id, emp.id, emp.name, emp.department)
      toast({ title: "Asset Transferred", description: `Transferred "${activeAsset.name}" to ${emp.name}.` })
    } else {
      // Just update asset directly if no allocation found
      updateAsset(activeAsset.id, { assignedEmployee: emp.name, department: emp.department })
      toast({ title: "Asset Transferred", description: `Transferred "${activeAsset.name}" to ${emp.name}.` })
    }
    setIsTransferOpen(false)
    setTransferForm({ employeeId: "" })
  }

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeAsset) return

    addMaintenanceRequest({
      assetId: activeAsset.id,
      assetName: activeAsset.name,
      description: maintenanceForm.description,
      priority: maintenanceForm.priority,
    })

    toast({ title: "Maintenance Requested", description: `Submitted request for "${activeAsset.name}".` })
    setIsMaintenanceOpen(false)
    setMaintenanceForm({ description: "", priority: "Medium" })
  }

  const resetFormData = () => {
    setFormData({
      name: "",
      category: "",
      serialNumber: "",
      department: "",
      assignedEmployee: "",
      location: "",
      purchaseDate: "",
      condition: "NEW",
      status: "Available",
      sharedResource: false,
    })
  }

  const startEdit = (asset: Asset) => {
    setActiveAsset(asset)
    setFormData({
      name: asset.name,
      category: asset.category,
      serialNumber: asset.serialNumber,
      department: asset.department,
      assignedEmployee: asset.assignedEmployee,
      location: asset.location,
      purchaseDate: asset.purchaseDate,
      condition: asset.condition,
      status: asset.status,
      sharedResource: asset.sharedResource,
    })
    setIsEditOpen(true)
  }

  const startAllocate = (asset: Asset) => {
    setActiveAsset(asset)
    setIsAllocateOpen(true)
  }

  const startTransfer = (asset: Asset) => {
    setActiveAsset(asset)
    setIsTransferOpen(true)
  }

  const startMaintenance = (asset: Asset) => {
    setActiveAsset(asset)
    setIsMaintenanceOpen(true)
  }

  // Filter & Sort Logic
  const filteredAssets = assets
    .filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
        a.assetTag.toLowerCase().includes(search.toLowerCase()) ||
        a.assignedEmployee.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === "all" || a.category === selectedCategory
      const matchesStatus = selectedStatus === "all" || a.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      let aVal = a[sortField] || ""
      let bVal = b[sortField] || ""
      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal)
      }
      return 0
    })

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusColors = {
    Available: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Allocated: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "Under Maintenance": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Disposed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Directory"
        description="Comprehensive directory of enterprise resources and asset assignments"
        actions={
          <Button onClick={() => { resetFormData(); setIsRegisterOpen(true) }} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Register Asset
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, tag, SN or user..." />
        </div>
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <ComboSelect
            options={[{ value: "all", label: "All Categories" }, ...categories.map((c) => ({ value: c.name, label: c.name }))]}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            placeholder="All Categories"
            searchPlaceholder="Search categories..."
            className="w-40 bg-card"
          />

          <ComboSelect
            options={[
              { value: "all", label: "All Statuses" },
              { value: "Available", label: "Available" },
              { value: "Allocated", label: "Allocated" },
              { value: "Under Maintenance", label: "Under Maintenance" },
              { value: "Disposed", label: "Disposed" },
            ]}
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            placeholder="All Statuses"
            searchable={false}
            className="w-40 bg-card"
          />

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="h-9">
              <Trash2 className="size-4 mr-1" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedAssets.length > 0 && paginatedAssets.every((a) => selectedIds.includes(a.id))}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border size-3.5 accent-foreground cursor-pointer"
                  />
                </th>
                <th className="p-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("assetTag")}>
                  Tag {sortField === "assetTag" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("name")}>
                  Asset Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort("category")}>
                  Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="p-4 hidden md:table-cell">Serial Number</th>
                <th className="p-4 hidden sm:table-cell">Assignee</th>
                <th className="p-4 hidden lg:table-cell">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => {
                const isSelected = selectedIds.includes(asset.id)
                return (
                  <tr
                    key={asset.id}
                    className={`border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors duration-150 ${
                      isSelected ? "bg-accent/10" : ""
                    }`}
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(asset.id, e.target.checked)}
                        className="rounded border-border size-3.5 accent-foreground cursor-pointer"
                      />
                    </td>
                    <td className="p-4 font-mono text-[12px] font-medium text-muted-foreground">{asset.assetTag}</td>
                    <td className="p-4 text-[13px] font-medium text-foreground">{asset.name}</td>
                    <td className="p-4 text-[13px] text-muted-foreground">{asset.category}</td>
                    <td className="p-4 text-[13px] text-muted-foreground hidden md:table-cell">{asset.serialNumber}</td>
                    <td className="p-4 text-[13px] hidden sm:table-cell">
                      {asset.assignedEmployee ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{asset.assignedEmployee}</span>
                          <span className="text-[10px] text-muted-foreground">{asset.department}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4 text-[13px] text-muted-foreground hidden lg:table-cell">{asset.location}</td>
                    <td className="p-4">
                      <Badge variant="outline" className={`h-5 text-[10px] font-medium rounded-full ${statusColors[asset.status]}`}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-[13px]">
                          <DropdownMenuItem onClick={() => { setActiveAsset(asset); setIsViewOpen(true) }}>
                            <Eye className="size-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => startEdit(asset)}>
                            <Edit2 className="size-3.5 mr-2" />
                            Edit Asset
                          </DropdownMenuItem>
                          {asset.status === "Available" && (
                            <DropdownMenuItem onClick={() => startAllocate(asset)}>
                              <UserCheck className="size-3.5 mr-2" />
                              Allocate
                            </DropdownMenuItem>
                          )}
                          {asset.status === "Allocated" && (
                            <>
                              <DropdownMenuItem onClick={() => startTransfer(asset)}>
                                <ArrowRightLeft className="size-3.5 mr-2" />
                                Transfer Assignment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                updateAsset(asset.id, { status: "Available", assignedEmployee: "", department: "" })
                                toast({ title: "Asset Returned", description: `Returned "${asset.name}" to inventory.` })
                              }}>
                                <Package className="size-3.5 mr-2" />
                                Return Asset
                              </DropdownMenuItem>
                            </>
                          )}
                          {asset.status !== "Under Maintenance" && (
                            <DropdownMenuItem onClick={() => startMaintenance(asset)}>
                              <Wrench className="size-3.5 mr-2" />
                              Raise Maintenance
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { setActiveAsset(asset); setIsDeleteOpen(true) }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
              {paginatedAssets.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-sm text-muted-foreground">
                    No assets found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <p className="text-[12px] text-muted-foreground">
            Showing {paginatedAssets.length} of {filteredAssets.length} assets
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

      {/* REGISTER ASSET DIALOG */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MacBook Pro M3"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Category</label>
                  <ComboSelect
                    options={categories.map((c) => ({ value: c.name, label: c.name }))}
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                    placeholder="Select Category"
                    searchPlaceholder="Search categories..."
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. SN-9817298"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. HQ - Floor 3"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Purchase Date</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Condition</label>
                  <ComboSelect
                    options={[
                      { value: "NEW", label: "New" },
                      { value: "GOOD", label: "Good" },
                      { value: "FAIR", label: "Fair" },
                      { value: "POOR", label: "Poor" },
                    ]}
                    value={formData.condition}
                    onValueChange={(val) => setFormData({ ...formData, condition: val as Asset["condition"] })}
                    placeholder="Select Condition"
                    searchable={false}
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Initial Status</label>
                  <ComboSelect
                    options={[
                      { value: "Available", label: "Available" },
                      { value: "Allocated", label: "Allocated" },
                      { value: "Under Maintenance", label: "Under Maintenance" },
                    ]}
                    value={formData.status}
                    onValueChange={(val) => setFormData({ ...formData, status: val as Asset["status"] })}
                    placeholder="Select Status"
                    searchable={false}
                  />
                </div>
              </div>

              {formData.status === "Allocated" && (
                <div className="grid grid-cols-2 gap-3 border border-border/50 rounded-lg p-3 bg-muted/10">
                  <div>
                    <label className="text-muted-foreground block mb-1">Assign Employee</label>
                    <ComboSelect
                      options={employees.map((e) => ({ value: e.name, label: e.name, description: e.department }))}
                      value={formData.assignedEmployee}
                      onValueChange={(val) => {
                        const emp = employees.find((emp) => emp.name === val)
                        setFormData({
                          ...formData,
                          assignedEmployee: val,
                          department: emp ? emp.department : "",
                        })
                      }}
                      placeholder="Select Employee"
                      searchPlaceholder="Search employees..."
                    />
                  </div>
                  <div>
                    <label className="text-muted-foreground block mb-1">Department</label>
                    <input
                      type="text"
                      disabled
                      value={formData.department}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-muted/50 outline-none text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="sharedResource"
                  checked={formData.sharedResource}
                  onChange={(e) => setFormData({ ...formData, sharedResource: e.target.checked })}
                  className="rounded border-border size-4 accent-foreground cursor-pointer"
                />
                <label htmlFor="sharedResource" className="text-muted-foreground font-medium select-none cursor-pointer">
                  Shared resource (AV, projector, etc.)
                </label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT ASSET DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MacBook Pro M3"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Category</label>
                  <ComboSelect
                    options={categories.map((c) => ({ value: c.name, label: c.name }))}
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                    placeholder="Select Category"
                    searchPlaceholder="Search categories..."
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="e.g. SN-9817298"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. HQ - Floor 3"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Condition</label>
                  <ComboSelect
                    options={[
                      { value: "NEW", label: "New" },
                      { value: "GOOD", label: "Good" },
                      { value: "FAIR", label: "Fair" },
                      { value: "POOR", label: "Poor" },
                    ]}
                    value={formData.condition}
                    onValueChange={(val) => setFormData({ ...formData, condition: val as Asset["condition"] })}
                    placeholder="Select Condition"
                    searchable={false}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ALLOCATE ASSET DIALOG */}
      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAllocateSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <span className="text-muted-foreground block mb-1">Asset Name</span>
                <p className="font-semibold text-sm">{activeAsset?.name} ({activeAsset?.assetTag})</p>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Employee</label>
                <ComboSelect
                  options={employees.map((e) => ({
                    value: e.id,
                    label: e.name,
                    description: e.department,
                  }))}
                  value={allocationForm.employeeId}
                  onValueChange={(val) => setAllocationForm({ ...allocationForm, employeeId: val })}
                  placeholder="Select Assignee"
                  searchPlaceholder="Search employees..."
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Expected Return Date</label>
                <input
                  type="date"
                  required
                  value={allocationForm.expectedReturnDate}
                  onChange={(e) => setAllocationForm({ ...allocationForm, expectedReturnDate: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAllocateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Allocate Asset
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
                <p className="font-semibold text-sm">{activeAsset?.name} ({activeAsset?.assetTag})</p>
                <span className="text-muted-foreground block mt-2 mb-1">Current Assignee</span>
                <p className="text-sm font-medium">{activeAsset?.assignedEmployee || "None"}</p>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Transfer To (Employee)</label>
                <ComboSelect
                  options={employees.map((e) => ({
                    value: e.id,
                    label: e.name,
                    description: e.department,
                  }))}
                  value={transferForm.employeeId}
                  onValueChange={(val) => setTransferForm({ ...transferForm, employeeId: val })}
                  placeholder="Select New Assignee"
                  searchPlaceholder="Search employees..."
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsTransferOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Transfer Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RAISE MAINTENANCE DIALOG */}
      <Dialog open={isMaintenanceOpen} onOpenChange={setIsMaintenanceOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Maintenance</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMaintenanceSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <span className="text-muted-foreground block mb-1">Asset Name</span>
                <p className="font-semibold text-sm">{activeAsset?.name} ({activeAsset?.assetTag})</p>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Problem Description</label>
                <textarea
                  required
                  rows={3}
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  placeholder="Explain the issue in detail..."
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Priority</label>
                <select
                  value={maintenanceForm.priority}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsMaintenanceOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{activeAsset?.name}"</span>? This action is irreversible.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DETAILS DRAWER SHEET */}
      <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="size-5 text-muted-foreground" />
              Asset Details
            </SheetTitle>
            <SheetDescription>
              Details and assignment history for {activeAsset?.assetTag}
            </SheetDescription>
          </SheetHeader>

          {activeAsset && (
            <div className="py-6 space-y-6 text-[13px]">
              <div>
                <h3 className="font-medium text-foreground text-sm mb-3">General Information</h3>
                <div className="grid gap-3.5 bg-muted/15 border border-border/40 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Tag className="size-3.5" /> Name</span>
                    <span className="font-medium">{activeAsset.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Layers className="size-3.5" /> Category</span>
                    <span className="font-medium">{activeAsset.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Hash className="size-3.5" /> Serial Number</span>
                    <span className="font-mono font-medium">{activeAsset.serialNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3.5" /> Location</span>
                    <span className="font-medium">{activeAsset.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="size-3.5" /> Purchase Date</span>
                    <span className="font-medium">{activeAsset.purchaseDate || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground text-sm mb-3">Assignment & Status</h3>
                <div className="grid gap-3.5 bg-muted/15 border border-border/40 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Status</span>
                    <Badge variant="outline" className={`h-5 text-[10px] rounded-full ${statusColors[activeAsset.status]}`}>
                      {activeAsset.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Assignee</span>
                    <span className="font-medium">{activeAsset.assignedEmployee || "Unassigned"}</span>
                  </div>
                  {activeAsset.assignedEmployee && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{activeAsset.department}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shared Resource</span>
                    <span className="font-medium">{activeAsset.sharedResource ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <Badge variant="secondary" className="h-5 rounded-md">{activeAsset.condition}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
