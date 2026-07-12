"use client"

import { type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "default"

interface StatusChipProps extends Omit<ComponentProps<typeof Badge>, "variant"> {
  status: StatusVariant
  label: string
  dot?: boolean
}

const variantStyles: Record<StatusVariant, string> = {
  success: "bg-secondary text-foreground border-border/50",
  warning: "bg-secondary text-foreground border-border/50",
  danger: "bg-secondary text-foreground border-border/50",
  info: "bg-secondary text-foreground border-border/50",
  neutral: "bg-muted text-muted-foreground border-border/50",
  default: "bg-muted text-muted-foreground border-border/50",
}

const dotStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-muted-foreground",
  default: "bg-muted-foreground",
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
