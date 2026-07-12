"use client"

import { cn } from "@/lib/utils"
import { Badge, type BadgeProps } from "@/components/ui/badge"

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "default"

interface StatusChipProps extends Omit<BadgeProps, "variant"> {
  status: StatusVariant
  label: string
  dot?: boolean
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
}

const dotStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-slate-500",
  default: "bg-slate-500",
}

export function StatusChip({ status, label, dot = true, className, ...props }: StatusChipProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium text-xs px-2.5 py-0.5 rounded-full",
        variantStyles[status],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("size-1.5 rounded-full", dotStyles[status])} />
      )}
      {label}
    </Badge>
  )
}