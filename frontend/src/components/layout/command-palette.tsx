"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useERPStore } from "@/stores/erp.store"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  LayoutDashboard,
  Package,
  Users,
  Building,
  FolderOpen,
  ArrowRightLeft,
  CalendarCheck,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Settings,
  User,
  PlusCircle,
  FileSpreadsheet,
  History,
} from "lucide-react"

export function CommandPalette() {
  const router = useRouter()
  const {
    isCommandPaletteOpen: isOpen,
    setCommandPaletteOpen: setIsOpen,
    assets,
    employees,
    departments,
    bookings,
    maintenance,
    audits,
  } = useERPStore()

  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // Load recent searches
  React.useEffect(() => {
    const saved = localStorage.getItem("assetflow_recent_searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        // Ignore
      }
    }
  }, [isOpen])

  // Save recent search helper
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(0, 8)
    setRecentSearches(updated)
    localStorage.setItem("assetflow_recent_searches", JSON.stringify(updated))
  }

  // Debounce the search input by 200ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 200)
    return () => clearTimeout(timer)
  }, [search])

  // Keyboard shortcut listener
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const isK = e.key === "k" || e.key === "K"
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      const isAlt = e.altKey

      if (isK && (isCtrlOrCmd || isAlt)) {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [isOpen, setIsOpen])

  // Navigation handlers
  const handleNavigate = (path: string, queryToSave?: string) => {
    if (queryToSave) {
      addRecentSearch(queryToSave)
    }
    router.push(path)
    setIsOpen(false)
    setSearch("")
  }

  // Dynamic filter lists based on search term
  const query = debouncedSearch.toLowerCase().trim()

  const filterItems = <T,>(
    items: T[],
    checkFn: (item: T) => boolean
  ) => {
    if (!query) return items.slice(0, 4)
    return items.filter(checkFn)
  }

  const filteredAssets = filterItems(assets, (a) =>
    a.name.toLowerCase().includes(query) ||
    a.assetTag.toLowerCase().includes(query) ||
    a.serialNumber.toLowerCase().includes(query) ||
    a.category.toLowerCase().includes(query) ||
    a.location.toLowerCase().includes(query) ||
    a.assignedEmployee.toLowerCase().includes(query)
  )

  const filteredEmployees = filterItems(employees, (e) =>
    e.name.toLowerCase().includes(query) ||
    e.email.toLowerCase().includes(query) ||
    e.department.toLowerCase().includes(query) ||
    e.role.toLowerCase().includes(query)
  )

  const filteredDepts = filterItems(departments, (d) =>
    d.name.toLowerCase().includes(query) ||
    d.head.toLowerCase().includes(query) ||
    d.parentDepartment.toLowerCase().includes(query)
  )

  const filteredBookings = filterItems(bookings, (b) =>
    b.resource.toLowerCase().includes(query) ||
    b.purpose.toLowerCase().includes(query) ||
    b.department.toLowerCase().includes(query)
  )

  const filteredMaintenance = filterItems(maintenance, (m) =>
    m.assetName.toLowerCase().includes(query) ||
    m.description.toLowerCase().includes(query) ||
    m.technician.toLowerCase().includes(query)
  )

  const filteredAudits = filterItems(audits, (a) =>
    a.name.toLowerCase().includes(query) ||
    a.scope.toLowerCase().includes(query) ||
    a.department.toLowerCase().includes(query) ||
    a.auditor.toLowerCase().includes(query)
  )

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen} className="dark bg-card border border-border/60 rounded-xl overflow-hidden shadow-2xl">
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
        className="text-[13px] h-12 border-none outline-none focus:ring-0"
      />
      <CommandList className="max-h-[350px] overflow-y-auto px-2 py-3 space-y-2">
        <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
          No matching results found.
        </CommandEmpty>

        {/* RECENT SEARCHES */}
        {!search && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches" className="text-[11px] font-medium text-muted-foreground px-2">
            {recentSearches.map((hist, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => setSearch(hist)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <History className="size-3.5 mr-2 text-muted-foreground" />
                <span>{hist}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* QUICK ACTIONS */}
        <CommandGroup heading="Quick Actions" className="text-[11px] font-medium text-muted-foreground px-2">
          <CommandItem
            onSelect={() => handleNavigate("/assets?action=register", "Register Asset")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <PlusCircle className="size-3.5 mr-2 text-blue-500" />
            <span>Register Asset</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/organization/employees?action=invite", "Invite Employee")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <PlusCircle className="size-3.5 mr-2 text-emerald-500" />
            <span>Invite Employee</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/organization/departments?action=create", "Create Department")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <PlusCircle className="size-3.5 mr-2 text-amber-500" />
            <span>Create Department</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/organization/asset-categories?action=create", "Create Category")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <PlusCircle className="size-3.5 mr-2 text-purple-500" />
            <span>Create Category</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/bookings?action=book", "Book Resource")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <CalendarCheck className="size-3.5 mr-2 text-pink-500" />
            <span>Book Resource</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/maintenance?action=request", "Request Maintenance")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <Wrench className="size-3.5 mr-2 text-orange-500" />
            <span>Raise Maintenance Request</span>
          </CommandItem>
          <CommandItem
            onSelect={() => handleNavigate("/reports", "Export Report")}
            className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
          >
            <FileSpreadsheet className="size-3.5 mr-2 text-teal-500" />
            <span>Export Report</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {/* PAGES */}
        <CommandGroup heading="Navigation Pages" className="text-[11px] font-medium text-muted-foreground px-2">
          {[
            { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
            { title: "Assets Directory", icon: Package, path: "/assets" },
            { title: "Employees", icon: Users, path: "/organization/employees" },
            { title: "Departments", icon: Building, path: "/organization/departments" },
            { title: "Asset Categories", icon: FolderOpen, path: "/organization/asset-categories" },
            { title: "Allocations Log", icon: ArrowRightLeft, path: "/allocations" },
            { title: "Bookings", icon: CalendarCheck, path: "/bookings" },
            { title: "Maintenance", icon: Wrench, path: "/maintenance" },
            { title: "Audits Cycle", icon: ClipboardCheck, path: "/audits" },
            { title: "Reports", icon: BarChart3, path: "/reports" },
            { title: "Notifications", icon: Bell, path: "/notifications" },
            { title: "Settings", icon: Settings, path: "/settings" },
          ]
            .filter((p) => p.title.toLowerCase().includes(query))
            .map((page) => (
              <CommandItem
                key={page.path}
                onSelect={() => handleNavigate(page.path)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <page.icon className="size-3.5 mr-2 text-muted-foreground" />
                <span>{page.title}</span>
              </CommandItem>
            ))}
        </CommandGroup>

        {/* ASSETS */}
        {filteredAssets.length > 0 && (
          <CommandGroup heading="Assets" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredAssets.map((asset) => (
              <CommandItem
                key={asset.id}
                onSelect={() => handleNavigate(`/assets?id=${asset.id}`, asset.name)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <Package className="size-3.5 mr-2 text-muted-foreground" />
                <span className="font-medium mr-1.5">{asset.name}</span>
                <span className="text-[11px] text-muted-foreground font-mono">({asset.assetTag})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* EMPLOYEES */}
        {filteredEmployees.length > 0 && (
          <CommandGroup heading="Employees" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredEmployees.map((emp) => (
              <CommandItem
                key={emp.id}
                onSelect={() => handleNavigate(`/organization/employees?id=${emp.id}`, emp.name)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <Users className="size-3.5 mr-2 text-muted-foreground" />
                <span>{emp.name} ({emp.department})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* DEPARTMENTS */}
        {filteredDepts.length > 0 && (
          <CommandGroup heading="Departments" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredDepts.map((d) => (
              <CommandItem
                key={d.id}
                onSelect={() => handleNavigate(`/organization/departments?search=${d.name}`, d.name)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <Building className="size-3.5 mr-2 text-muted-foreground" />
                <span>{d.name} Department</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* BOOKINGS */}
        {filteredBookings.length > 0 && (
          <CommandGroup heading="Bookings" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredBookings.map((b) => (
              <CommandItem
                key={b.id}
                onSelect={() => handleNavigate(`/bookings?search=${b.resource}`, b.resource)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <CalendarCheck className="size-3.5 mr-2 text-muted-foreground" />
                <span>{b.resource} - {b.purpose}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* MAINTENANCE */}
        {filteredMaintenance.length > 0 && (
          <CommandGroup heading="Maintenance Requests" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredMaintenance.map((m) => (
              <CommandItem
                key={m.id}
                onSelect={() => handleNavigate(`/maintenance?search=${m.assetName}`, m.assetName)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <Wrench className="size-3.5 mr-2 text-muted-foreground" />
                <span>{m.assetName} - {m.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* AUDITS */}
        {filteredAudits.length > 0 && (
          <CommandGroup heading="Audit Cycles" className="text-[11px] font-medium text-muted-foreground px-2">
            {filteredAudits.map((a) => (
              <CommandItem
                key={a.id}
                onSelect={() => handleNavigate(`/audits?search=${a.name}`, a.name)}
                className="h-8.5 rounded-lg text-[13px] text-foreground hover:bg-accent cursor-pointer px-2"
              >
                <ClipboardCheck className="size-3.5 mr-2 text-muted-foreground" />
                <span>{a.name} ({a.department})</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
