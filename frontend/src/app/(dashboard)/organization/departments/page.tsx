"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, Department } from "@/stores/erp.store"
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
  Building,
  User,
  Edit2,
  Trash2,
  Archive,
  CheckCircle,
} from "lucide-react"

export default function DepartmentsPage() {
  const { toast } = useToast()
  const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useERPStore()

  // State
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeDept, setActiveDept] = useState<Department | null>(null)

  // Forms
  const [createForm, setCreateForm] = useState({
    name: "",
    parentDepartment: "None",
    head: "",
    status: "Active" as "Active" | "Archived",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    parentDepartment: "None",
    head: "",
    status: "Active" as "Active" | "Archived",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")
      const searchParam = params.get("search")

      if (action === "create") {
        setCreateForm({ name: "", parentDepartment: "None", head: "", status: "Active" })
        setIsCreateOpen(true)
      } else if (searchParam) {
        setSearch(searchParam)
      }
    }
  }, [])

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name || !createForm.head) return

    addDepartment(createForm)
    toast({ title: "Department Created", description: `"${createForm.name}" department has been added.` })
    setIsCreateOpen(false)
    setCreateForm({ name: "", parentDepartment: "None", head: "", status: "Active" })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeDept) return

    updateDepartment(activeDept.id, editForm)
    toast({ title: "Department Updated", description: `Successfully updated "${editForm.name}".` })
    setIsEditOpen(false)
    setActiveDept(null)
  }

  const handleDeleteConfirm = () => {
    if (!activeDept) return
    deleteDepartment(activeDept.id)
    toast({ title: "Department Deleted", description: `Removed department "${activeDept.name}".` })
    setIsDeleteOpen(false)
    setActiveDept(null)
  }

  const toggleArchive = (dept: Department) => {
    const newStatus = dept.status === "Active" ? "Archived" : "Active"
    updateDepartment(dept.id, { status: newStatus })
    toast({
      title: newStatus === "Active" ? "Department Restored" : "Department Archived",
      description: `"${dept.name}" is now ${newStatus.toLowerCase()}.`,
    })
  }

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase()) ||
    d.parentDepartment.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Departments"
        description="Organize your workforce structure, assign heads, and track employee resources"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Create Department
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search departments..." />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Department Name</th>
                <th className="p-4">Head of Department</th>
                <th className="p-4">Parent Department</th>
                <th className="p-4">Employee Count</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepts.map((dept) => {
                // calculate dynamically count of employees in store
                const realCount = employees.filter((e) => e.department === dept.name).length
                return (
                  <tr key={dept.id} className="border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground">
                        <Building className="size-4 text-muted-foreground" />
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">{dept.name}</span>
                    </td>
                    <td className="p-4 text-[13px] text-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3.5 text-muted-foreground/60" />
                        <span>{dept.head}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-muted-foreground">{dept.parentDepartment}</td>
                    <td className="p-4 text-[13px] text-foreground font-medium tabular-nums">{realCount} members</td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={`h-5 text-[10px] rounded-full ${
                          dept.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}
                      >
                        {dept.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                          setActiveDept(dept)
                          setEditForm({ name: dept.name, parentDepartment: dept.parentDepartment, head: dept.head, status: dept.status })
                          setIsEditOpen(true)
                        }}
                        title="Edit"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => toggleArchive(dept)}
                        title={dept.status === "Active" ? "Archive" : "Restore"}
                      >
                        {dept.status === "Active" ? (
                          <Archive className="size-3.5 text-amber-600 hover:text-amber-700" />
                        ) : (
                          <CheckCircle className="size-3.5 text-emerald-600 hover:text-emerald-700" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/5"
                        onClick={() => {
                          setActiveDept(dept)
                          setIsDeleteOpen(true)
                        }}
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
              {filteredDepts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Product Engineering"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Parent Department</label>
                  <select
                    value={createForm.parentDepartment}
                    onChange={(e) => setCreateForm({ ...createForm, parentDepartment: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="None">None</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Department Head</label>
                  <select
                    required
                    value={createForm.head}
                    onChange={(e) => setCreateForm({ ...createForm, head: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select Head</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Parent Department</label>
                  <select
                    value={editForm.parentDepartment}
                    onChange={(e) => setEditForm({ ...editForm, parentDepartment: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="None">None</option>
                    {departments
                      .filter((d) => d.id !== activeDept?.id)
                      .map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Department Head</label>
                  <select
                    required
                    value={editForm.head}
                    onChange={(e) => setEditForm({ ...editForm, head: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
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

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to delete department <span className="font-semibold text-foreground">"{activeDept?.name}"</span>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
