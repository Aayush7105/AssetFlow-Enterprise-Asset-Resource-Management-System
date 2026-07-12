import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon?: LucideIcon
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  className?: string
}

export function StatsCard({ title, value, change, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card p-6", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {change && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          {change.trend === "up" && (
            <span className="inline-flex items-center gap-1 text-success">
              <ArrowUp className="size-3" />
              {change.value > 0 ? "+" : ""}
              {change.value}%
            </span>
          )}
          {change.trend === "down" && (
            <span className="inline-flex items-center gap-1 text-destructive">
              <ArrowDown className="size-3" />
              {change.value > 0 ? "+" : ""}
              {change.value}%
            </span>
          )}
          {change.trend === "neutral" && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Minus className="size-3" />
              {change.value > 0 ? "+" : ""}
              {change.value}%
            </span>
          )}
          <span>from last month</span>
        </div>
      )}
    </div>
  )
}
