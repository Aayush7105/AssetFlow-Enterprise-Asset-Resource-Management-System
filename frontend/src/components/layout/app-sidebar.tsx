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
  SidebarSeparator,
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
  Users,
  Building2,
  Shield,
  FolderOpen,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import { useNotificationStore } from "@/stores/notification.store"
import { useAuthStore } from "@/stores/auth.store"
import { hasPermission } from "@/lib/permissions"
import { useAuth } from "@/modules/auth/hooks"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD, module: "dashboard" },
  { title: "Assets", icon: Package, href: ROUTES.ASSETS, module: "assets" },
  { title: "Allocations", icon: ArrowRightLeft, href: ROUTES.ALLOCATIONS, module: "allocations" },
  { title: "Bookings", icon: CalendarCheck, href: ROUTES.BOOKINGS, module: "bookings" },
  { title: "Maintenance", icon: Wrench, href: ROUTES.MAINTENANCE, module: "maintenance" },
  { title: "Audits", icon: ClipboardCheck, href: ROUTES.AUDITS, module: "audits" },
  { title: "Reports", icon: BarChart3, href: ROUTES.REPORTS, module: "reports" },
]

const orgMenuItems = [
  { title: "Employees", icon: Users, href: ROUTES.ORGANIZATION_EMPLOYEES },
  { title: "Departments", icon: Building2, href: ROUTES.ORGANIZATION_DEPARTMENTS },
  { title: "Roles", icon: Shield, href: ROUTES.ORGANIZATION_ROLES },
  { title: "Asset Categories", icon: FolderOpen, href: ROUTES.ORGANIZATION_ASSET_CATEGORIES },
]

const bottomMenuItems = [
  { title: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS, showBadge: true, module: "notifications" },
  { title: "Settings", icon: Settings, href: ROUTES.SETTINGS, module: "settings" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const user = useAuthStore((s) => s.user)
  const { logout } = useAuth()
  const router = useRouter()

  const displayName = user?.name || "John Doe"
  const displayRole = user?.role || "admin"
  const orgName = user?.organizationName || "Acme Enterprise"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const isAdmin = displayRole === "admin"

  const filteredMain = mainMenuItems.filter((item) =>
    hasPermission(displayRole, item.module)
  )
  const filteredBottom = bottomMenuItems.filter((item) =>
    hasPermission(displayRole, item.module)
  )

  const handleLogout = async () => {
    await logout()
    router.push(ROUTES.LOGIN)
  }

  const roleLabel = displayRole.replace(/_/g, " ")

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link href={ROUTES.DASHBOARD}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                  <Layers className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold tracking-tight">AssetFlow</span>
                  <span className="truncate text-[11px] text-muted-foreground">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70 px-3 mb-1">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMain.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-8 rounded-lg text-[13px] font-normal transition-all duration-150",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-[16px]" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <>
            <SidebarSeparator className="mx-3 my-2" />
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70 px-3 mb-1">
                Organization
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {orgMenuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "h-8 rounded-lg text-[13px] font-normal transition-all duration-150",
                            isActive
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className="size-[16px]" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator className="mx-3 my-2" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredBottom.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-8 rounded-lg text-[13px] font-normal transition-all duration-150",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="size-[16px]" />
                        <span>{item.title}</span>
                        {item.showBadge && unreadCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium px-1.5">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-auto py-2 hover:bg-accent/50 transition-colors duration-150 rounded-lg"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground text-xs font-medium">
                    {initials}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-medium">{displayName}</span>
                    <span className="truncate text-[11px] text-muted-foreground capitalize">{roleLabel}</span>
                    <span className="truncate text-[10px] text-muted-foreground/60">{orgName}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "john@company.com"}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
