"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Plus className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Departments</h3>
          <p className="text-sm text-muted-foreground">Create departments in your organization</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="dept-name" className="text-xs">Department Name</Label>
          <Input id="dept-name" placeholder="e.g., Engineering" />
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full gap-2">
            <Plus className="size-4" />
            Add Department
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Head</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">No departments added yet</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}