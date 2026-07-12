"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default function AssetCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Plus className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Asset Categories</h3>
          <p className="text-sm text-muted-foreground">Define categories for your assets</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="cat-name" className="text-xs">Category Name</Label>
          <Input id="cat-name" placeholder="e.g., Laptops" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cat-code" className="text-xs">Code</Label>
          <Input id="cat-code" placeholder="e.g., LAP" />
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full gap-2">
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">No categories added yet</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}