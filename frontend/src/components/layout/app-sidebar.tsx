"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  CalendarCheck,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { useNotificationStore } from "@/stores/notification.store"
import { useAuthStore } from "@/stores/auth.store"
import { hasPermission } from "@/lib/permissions"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD, module: "dashboard" },
  { title: "Assets", icon: Package, href: ROUTES.ASSETS, module: "assets" },
  { title: "Allocations", icon: ArrowRightLeft, href: ROUTES.ALLOCATIONS, module: "allocations" },
  { title: "Bookings", icon: CalendarCheck, href: ROUTES.BOOKINGS, module: "bookings" },
  { title: "Maintenance", icon: Wrench, href: ROUTES.MAINTENANCE, module: "maintenance" },
  { title: "Audits", icon: ClipboardCheck, href: ROUTES.AUDITS, module: "audits" },
  { title: "Reports", icon: BarChart3, href: ROUTES.REPORTS, module: "reports" },
  { title: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS, showBadge: true, module: "notifications" },
  { title: "Settings", icon: Settings, href: ROUTES.SETTINGS, module: "settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const user = useAuthStore((s) => s.user)

  const displayName = user?.name || "John Doe"
  const displayRole = user?.role || "admin"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const filteredMenuItems = menuItems.filter((item) =>
    hasPermission(displayRole, item.module)
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Layers className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AssetFlow</span>
                  <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className={cn(
                      "transition-colors duration-150",
                      pathname === item.href && "bg-accent"
                    )}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.showBadge && unreadCount > 0 && (
                        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <span className="text-xs font-medium">{initials}</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground uppercase">{displayRole.replace("_", " ")}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
