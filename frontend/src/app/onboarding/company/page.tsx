"use client"

import { CheckCircle2, Building2, Mail, User } from "lucide-react"
import { useAuthStore } from "@/stores/auth.store"

export default function CompanyPage() {
  const user = useAuthStore((state) => state.user)
  const details = [
    { icon: Building2, label: "Organization", value: user?.organizationName || "AssetFlow" },
    { icon: User, label: "Admin", value: user?.name || "Not provided" },
    { icon: Mail, label: "Admin Email", value: user?.email || "Not provided" },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Organization registered successfully
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
              Your admin account has been created. Review your details below.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-muted shrink-0">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-medium truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Click <span className="font-medium text-foreground">Next</span> to set up your asset categories.
      </p>
    </div>
  )
}
