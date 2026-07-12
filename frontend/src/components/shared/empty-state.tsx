import { type LucideIcon } from "lucide-react"
import { type ReactNode } from "react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 p-12 text-center lg:p-16">
      <Icon className="size-10 text-muted-foreground/40" />
      <h3 className="text-sm font-medium text-foreground/80 mt-4">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
