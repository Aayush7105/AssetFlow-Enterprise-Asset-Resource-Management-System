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
import { Bell, Search, Moon, Sun, User, LogOut, Settings, HelpCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { useNotificationStore } from "@/stores/notification.store"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { useAuthStore } from "@/stores/auth.store"
import { useAuth } from "@/modules/auth/hooks"

export function AppNavbar() {
  const { theme, setTheme } = useTheme()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()

  const displayName = user?.name || "John Doe"
  const email = user?.email || "john@company.com"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    router.push(ROUTES.LOGIN)
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      <SidebarTrigger className="-ml-1" />

      <div className="flex-1" />

      <div className="hidden md:flex items-center bg-secondary/50 border border-border/50 rounded-full h-9 px-4 w-64">
        <Search className="size-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground w-full"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 text-muted-foreground"
        onClick={() => router.push(ROUTES.NOTIFICATIONS)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-foreground" />
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-9 rounded-full">
            <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              {initials}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 size-4" />
            Help
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
