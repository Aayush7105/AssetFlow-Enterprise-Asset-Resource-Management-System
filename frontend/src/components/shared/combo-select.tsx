"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboSelectOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface ComboSelectProps {
  options: ComboSelectOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  className?: string
  disabled?: boolean
}

export function ComboSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  searchable = true,
  className,
  disabled = false,
}: ComboSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const selected = options.find((opt) => opt.value === value)

  const filtered = query.trim()
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase()) ||
          opt.description?.toLowerCase().includes(query.toLowerCase()) ||
          opt.value.toLowerCase().includes(query.toLowerCase())
      )
    : options

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors",
            "hover:bg-accent/50 focus:ring-1 focus:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? (
              <span className="flex items-center gap-2">
                {selected.icon && <span className="shrink-0">{selected.icon}</span>}
                {selected.label}
              </span>
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="ml-2 size-3.5 shrink-0 text-muted-foreground/60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden"
        align="start"
        sideOffset={4}
      >
        {searchable && (
          <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2">
            <Search className="size-3.5 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
        )}
        <div className="max-h-[280px] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">No results found</div>
          ) : (
            filtered.map((opt) => {
              const isSelected = value === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onValueChange(opt.value)
                    setOpen(false)
                    setQuery("")
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition-colors duration-150 cursor-pointer",
                    isSelected
                      ? "bg-[#202024] text-[#fafafa]"
                      : "text-foreground hover:bg-[#27272a] hover:text-[#fafafa]"
                  )}
                >
                  {opt.icon && <span className="shrink-0 text-muted-foreground">{opt.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[13px] font-medium">{opt.label}</div>
                    {opt.description && (
                      <div className="truncate text-[11px] text-muted-foreground mt-0.5">{opt.description}</div>
                    )}
                  </div>
                  {isSelected && <Check className="size-3.5 shrink-0 text-emerald-400" />}
                </button>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
