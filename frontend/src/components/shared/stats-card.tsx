import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  className?: string
}

export function StatsCard({ title, value, icon: Icon, change, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-4 text-primary" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {change.trend === "up" && (
                <ArrowUp className="size-3 text-emerald-600" />
              )}
              {change.trend === "down" && (
                <ArrowDown className="size-3 text-red-600" />
              )}
              {change.trend === "neutral" && (
                <Minus className="size-3 text-muted-foreground" />
              )}
              <span
                className={cn(
                  change.trend === "up" && "text-emerald-600",
                  change.trend === "down" && "text-red-600",
                  change.trend === "neutral" && "text-muted-foreground"
                )}
              >
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}