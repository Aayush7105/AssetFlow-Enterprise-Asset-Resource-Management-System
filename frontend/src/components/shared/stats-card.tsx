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
  sparkline?: number[]
  lastUpdated?: string
  className?: string
}

function MiniSparkline({ data, trend }: { data: number[]; trend: "up" | "down" | "neutral" }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 24
  const w = 56
  const step = w / (data.length - 1)

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ")

  const strokeColor =
    trend === "up"
      ? "oklch(0.72 0.19 155)"
      : trend === "down"
        ? "oklch(0.64 0.22 25)"
        : "oklch(0.55 0 0)"

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StatsCard({ title, value, icon: Icon, change, sparkline, lastUpdated, className }: StatsCardProps) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-5 card-hover", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-3.5 text-muted-foreground" />
              </div>
            )}
            <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        {sparkline && change && (
          <MiniSparkline data={sparkline} trend={change.trend} />
        )}
      </div>

      {(change || lastUpdated) && (
        <div className="mt-3 flex items-center justify-between">
          {change && (
            <div className="flex items-center gap-1.5">
              {change.trend === "up" && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <ArrowUp className="size-2.5" />
                  {change.value}%
                </span>
              )}
              {change.trend === "down" && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-600 dark:text-red-400">
                  <ArrowDown className="size-2.5" />
                  {change.value}%
                </span>
              )}
              {change.trend === "neutral" && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <Minus className="size-2.5" />
                  {change.value}%
                </span>
              )}
              <span className="text-[11px] text-muted-foreground/60">vs last month</span>
            </div>
          )}
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground/50">{lastUpdated}</span>
          )}
        </div>
      )}
    </div>
  )
}
