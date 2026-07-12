"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, Employee } from "@/stores/erp.store"
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
  Edit2,
  Trash2,
  Send,
  XCircle,
  CheckCircle,
} from "lucide-react"

export default function EmployeesPage() {
  const { toast } = useToast()
  const { employees, departments, inviteEmployee, updateEmployee, deleteEmployee } = useERPStore()

  // Table state
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null)

  // Forms state
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "employee",
    status: "Active" as "Active" | "Inactive",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "employee",
    status: "Active" as "Active" | "Inactive",
  })

  // Handlers
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.name || !inviteForm.email || !inviteForm.department) return

    inviteEmployee(inviteForm)
    toast({ title: "Employee Invited", description: `Successfully sent invitation to ${inviteForm.name}.` })
    setIsInviteOpen(false)
    setInviteForm({ name: "", email: "", department: "", role: "employee", status: "Active" })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeEmployee) return

    updateEmployee(activeEmployee.id, editForm)
    toast({ title: "Employee Updated", description: `Successfully updated ${editForm.name}.` })
    setIsEditOpen(false)
    setActiveEmployee(null)
  }

  const handleDeleteConfirm = () => {
    if (!activeEmployee) return
    deleteEmployee(activeEmployee.id)
    toast({ title: "Employee Deleted", description: `Removed employee ${activeEmployee.name} from directory.` })
    setIsDeleteOpen(false)
    setActiveEmployee(null)
  }

  const toggleDeactivate = (emp: Employee) => {
    const newStatus = emp.status === "Active" ? "Inactive" : "Active"
    updateEmployee(emp.id, { status: newStatus })
    toast({
      title: newStatus === "Active" ? "Employee Activated" : "Employee Deactivated",
      description: `${emp.name} is now ${newStatus.toLowerCase()}.`,
    })
  }

  const resendInvitation = (emp: Employee) => {
    toast({ title: "Invitation Resent", description: `Resent invitation email to ${emp.email}.` })
  }

  // Filter list
  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Employees Directory"
        description="Manage organization workforce members, roles, and pending onboarding invitations"
        actions={
          <Button onClick={() => setIsInviteOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Invite Employee
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or department..." />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Invitation Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-[11px] font-medium text-foreground">
                      {initials(emp.name)}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground leading-none">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-1">{emp.email}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[13px] text-muted-foreground">{emp.department}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="h-5 text-[10px] rounded-md capitalize">
                      {emp.role.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={`h-5 text-[10px] rounded-full ${
                        emp.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                      }`}
                    >
                      {emp.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={`h-5 text-[10px] rounded-full ${
                        emp.invitationStatus === "Accepted"
                          ? "bg-muted text-muted-foreground"
                          : emp.invitationStatus === "Pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                      }`}
                    >
                      {emp.invitationStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => {
                        setActiveEmployee(emp)
                        setEditForm({ name: emp.name, email: emp.email, department: emp.department, role: emp.role, status: emp.status })
                        setIsEditOpen(true)
                      }}
                      title="Edit"
                    >
                      <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>
                    {emp.invitationStatus === "Pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => resendInvitation(emp)}
                        title="Resend Invite"
                      >
                        <Send className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => toggleDeactivate(emp)}
                      title={emp.status === "Active" ? "Deactivate" : "Activate"}
                    >
                      {emp.status === "Active" ? (
                        <XCircle className="size-3.5 text-amber-600 hover:text-amber-700" />
                      ) : (
                        <CheckCircle className="size-3.5 text-emerald-600 hover:text-emerald-700" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/5"
                      onClick={() => {
                        setActiveEmployee(emp)
                        setIsDeleteOpen(true)
                      }}
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
          <p className="text-[12px] text-muted-foreground">
            Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
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

      {/* INVITE EMPLOYEE DIALOG */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="e.g. Robert Taylor"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="e.g. robert.t@company.com"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Department</label>
                  <select
                    required
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Role Type</label>
                  <select
                    required
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="employee">Employee</option>
                    <option value="asset_manager">Asset Manager</option>
                    <option value="department_head">Department Head</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Invite Employee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT EMPLOYEE DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Department</label>
                  <select
                    required
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Role Type</label>
                  <select
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  >
                    <option value="employee">Employee</option>
                    <option value="asset_manager">Asset Manager</option>
                    <option value="department_head">Department Head</option>
                    <option value="auditor">Auditor</option>
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
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to remove <span className="font-semibold text-foreground">"{activeEmployee?.name}"</span> from the directory?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
