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
  Boxes,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { useNotificationStore } from "@/stores/notification.store"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
  { title: "Assets", icon: Package, href: ROUTES.ASSETS },
  { title: "Allocations", icon: ArrowRightLeft, href: ROUTES.ALLOCATIONS },
  { title: "Bookings", icon: CalendarCheck, href: ROUTES.BOOKINGS },
  { title: "Maintenance", icon: Wrench, href: ROUTES.MAINTENANCE },
  { title: "Audits", icon: ClipboardCheck, href: ROUTES.AUDITS },
  { title: "Reports", icon: BarChart3, href: ROUTES.REPORTS },
  { title: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS, showBadge: true },
  { title: "Settings", icon: Settings, href: ROUTES.SETTINGS },
]

export function AppSidebar() {
  const pathname = usePathname()
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Boxes className="size-4" />
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.showBadge && unreadCount > 0 && (
                        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
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
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <span className="text-xs font-medium">JD</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">John Doe</span>
                <span className="truncate text-xs text-muted-foreground">Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}