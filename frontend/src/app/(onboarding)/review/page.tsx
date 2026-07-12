"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Tag, Users, FolderTree } from "lucide-react"

export default function ReviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Review Setup</h3>
          <p className="text-sm text-muted-foreground">Verify your configuration before completing setup</p>
        </div>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="size-4" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No company data configured yet. Go back to complete the setup.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Tag className="size-4" />
              Asset Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No categories added yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderTree className="size-4" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No departments added yet.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4" />
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No employees added yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
