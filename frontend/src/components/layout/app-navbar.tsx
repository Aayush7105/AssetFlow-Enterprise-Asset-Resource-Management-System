"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"

interface AppNavbarProps {
  title?: string
}

export function AppNavbar({ title }: AppNavbarProps) {
  const { theme, setTheme } = useTheme()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      {title && (
        <h2 className="text-sm font-medium hidden sm:block">{title}</h2>
      )}

      <div className="flex-1" />

      {searchOpen ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search assets, employees..."
            className="h-9 w-48 lg:w-64"
            autoFocus
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="size-4" />
          <span className="sr-only">Search</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="relative size-9"
        onClick={() => router.push(ROUTES.NOTIFICATIONS)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 size-4 flex items-center justify-center rounded-full p-0 text-[10px]"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
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
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              JD
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">john@company.com</p>
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
          <DropdownMenuItem className="text-red-600">
            <LogOut className="mr-2 size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}