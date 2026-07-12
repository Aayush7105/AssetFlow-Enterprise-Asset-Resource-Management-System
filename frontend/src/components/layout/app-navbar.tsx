"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, User, LogOut, Command } from "lucide-react"
import { useTheme } from "next-themes"
import { useNotificationStore } from "@/stores/notification.store"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/auth.store"
import { useAuth } from "@/modules/auth/hooks"
import { useERPStore } from "@/stores/erp.store"

export function AppNavbar() {
  const { theme, setTheme } = useTheme()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()
  const setCommandPaletteOpen = useERPStore((s) => s.setCommandPaletteOpen)

  const displayName = user?.name || "John Doe"
  const email = user?.email || "john@company.com"
  const displayRole = user?.role || "admin"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    router.push(ROUTES.LOGIN)
  }

  const isDark = theme === "dark"

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      <SidebarTrigger className="-ml-1 size-8 text-muted-foreground hover:text-foreground transition-colors" />

      <div className="flex-1" />

      <button
        type="button"
        className="hidden md:flex items-center gap-2 bg-muted/50 border border-border/50 rounded-lg h-8 px-3 w-60 text-sm text-muted-foreground hover:bg-muted/80 hover:border-border transition-colors duration-150 cursor-pointer"
        onClick={() => setCommandPaletteOpen(true)}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left text-[13px]">Search...</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-border/80 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground/70">
          <Command className="size-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-0.5 ml-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-muted-foreground hover:text-foreground"
          onClick={() => router.push(ROUTES.NOTIFICATIONS)}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground text-background text-[9px] font-bold px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="relative flex h-7 w-12 items-center rounded-full bg-muted border border-border/50 p-0.5 transition-colors duration-200 hover:bg-muted/80 cursor-pointer"
          aria-label="Toggle theme"
        >
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200",
              isDark ? "translate-x-[18px]" : "translate-x-0"
            )}
          >
            {isDark ? (
              <svg className="size-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="size-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full ml-0.5">
              <div className="flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground text-[11px] font-medium">
                {initials}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
                <span className="mt-1 inline-flex w-fit items-center rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                  {displayRole.replace(/_/g, " ")}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)} className="text-[13px]">
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer text-[13px]" onClick={handleLogout}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
