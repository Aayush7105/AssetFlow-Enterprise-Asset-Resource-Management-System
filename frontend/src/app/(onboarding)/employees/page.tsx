"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ROLES } from "@/lib/constants"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Plus className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Employees & Roles</h3>
          <p className="text-sm text-muted-foreground">Add team members and assign roles</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="emp-first" className="text-xs">First Name</Label>
          <Input id="emp-first" placeholder="John" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emp-last" className="text-xs">Last Name</Label>
          <Input id="emp-last" placeholder="Doe" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emp-email" className="text-xs">Email</Label>
          <Input id="emp-email" type="email" placeholder="john@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="emp-role" className="text-xs">Role</Label>
          <Select>
            <SelectTrigger id="emp-role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="outline" className="gap-2">
        <Plus className="size-4" />
        Add Employee
      </Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-sm">No employees added yet</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}