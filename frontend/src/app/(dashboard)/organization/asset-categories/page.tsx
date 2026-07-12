"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ComboSelect } from "@/components/shared/combo-select"
import { Button } from "@/components/ui/button"
import { useERPStore, AssetCategory } from "@/stores/erp.store"
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
  Folder,
  Edit2,
  Trash2,
} from "lucide-react"

export default function AssetCategoriesPage() {
  const { toast } = useToast()
  const { categories, addCategory, updateCategory, deleteCategory, assets } = useERPStore()

  // State
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [activeCat, setActiveCat] = useState<AssetCategory | null>(null)

  // Forms
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    color: "blue",
  })

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    color: "blue",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")

      if (action === "create") {
        setCreateForm({ name: "", description: "", color: "blue" })
        setIsCreateOpen(true)
      }
    }
  }, [])

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name) return

    addCategory(createForm)
    toast({ title: "Category Created", description: `"${createForm.name}" category has been added.` })
    setIsCreateOpen(false)
    setCreateForm({ name: "", description: "", color: "blue" })
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeCat) return

    updateCategory(activeCat.id, editForm)
    toast({ title: "Category Updated", description: `Successfully updated category "${editForm.name}".` })
    setIsEditOpen(false)
    setActiveCat(null)
  }

  const handleDeleteConfirm = () => {
    if (!activeCat) return
    deleteCategory(activeCat.id)
    toast({ title: "Category Deleted", description: `Successfully removed category "${activeCat.name}".` })
    setIsDeleteOpen(false)
    setActiveCat(null)
  }

  const filteredCats = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Asset Categories"
        description="Classify your hardware devices, office items, and infrastructure resources"
        actions={
          <Button onClick={() => setIsCreateOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Create Category
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Category Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assets Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCats.map((cat) => {
                const assetCount = assets.filter((a) => a.category === cat.name).length
                return (
                  <tr key={cat.id} className="border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[cat.color as keyof typeof colorClasses] || colorClasses.blue}`}>
                        <Folder className="size-4" />
                      </div>
                      <span className="text-[13px] font-semibold text-foreground">{cat.name}</span>
                    </td>
                    <td className="p-4 text-[13px] text-muted-foreground max-w-xs truncate">{cat.description}</td>
                    <td className="p-4 text-[13px] text-foreground font-medium tabular-nums">{assetCount} assets</td>
                    <td className="p-4 text-right flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => {
                          setActiveCat(cat)
                          setEditForm({ name: cat.name, description: cat.description, color: cat.color })
                          setIsEditOpen(true)
                        }}
                        title="Edit"
                      >
                        <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive/80 hover:text-destructive hover:bg-destructive/5"
                        onClick={() => {
                          setActiveCat(cat)
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
              {filteredCats.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                    No categories found.
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
            <DialogTitle>Create Asset Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="e.g. Workstations"
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Brief description of category items..."
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Theme Color</label>
                <select
                  value={createForm.color}
                  onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="amber">Amber</option>
                  <option value="purple">Purple</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Theme Color</label>
                <ComboSelect
                  options={[
                    { value: "blue", label: "Blue" },
                    { value: "green", label: "Green" },
                    { value: "amber", label: "Amber" },
                    { value: "purple", label: "Purple" },
                    { value: "pink", label: "Pink" },
                  ]}
                  value={editForm.color}
                  onValueChange={(val) => setEditForm({ ...editForm, color: val })}
                  placeholder="Select Color"
                  searchable={false}
                />
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
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to delete category <span className="font-semibold text-foreground">"{activeCat?.name}"</span>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
