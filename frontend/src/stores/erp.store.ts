import { create } from "zustand"
import { apiRequest } from "@/lib/api"

export interface Asset {
  id: string
  name: string
  category: string
  serialNumber: string
  assetTag: string
  department: string
  assignedEmployee: string
  location: string
  purchaseDate: string
  condition: "NEW" | "GOOD" | "FAIR" | "POOR" | "DISPOSED"
  status: "Available" | "Allocated" | "Under Maintenance" | "Disposed"
  sharedResource: boolean
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
  status: "Active" | "Inactive"
  invitationStatus: "Accepted" | "Pending" | "Expired"
}

export interface Department {
  id: string
  name: string
  parentDepartment: string
  head: string
  employeeCount: number
  status: "Active" | "Archived"
}

export interface AssetCategory {
  id: string
  name: string
  description: string
  color: string
}

export interface Allocation {
  id: string
  assetId: string
  assetName: string
  employeeId: string
  employeeName: string
  department: string
  allocationDate: string
  expectedReturnDate: string
  status: "Active" | "Returned" | "Overdue"
}

export interface Booking {
  id: string
  resource: string
  date: string
  startTime: string
  endTime: string
  department: string
  purpose: string
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | "Completed"
}

export interface MaintenanceRequest {
  id: string
  assetId: string
  assetName: string
  description: string
  priority: "High" | "Medium" | "Low"
  status: "Pending" | "Approved" | "In Progress" | "Resolved" | "Rejected"
  technician: string
  createdAt: string
}

export interface AuditCycle {
  id: string
  name: string
  scope: string
  department: string
  auditor: string
  startDate: string
  endDate: string
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
}

export interface ERPNotification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  category: "all" | "alert" | "info"
}

export interface ERPActivity {
  initials: string
  action: string
  entity: string
  target?: string
  department: string
  time: string
  type: string
}

type BackendRecord = Record<string, any>

function mapAsset(asset: BackendRecord): Asset {
  const statusMap: Record<string, Asset["status"]> = {
    AVAILABLE: "Available",
    ALLOCATED: "Allocated",
    RESERVED: "Available",
    UNDER_MAINTENANCE: "Under Maintenance",
    LOST: "Disposed",
    RETIRED: "Disposed",
    DISPOSED: "Disposed",
  }

  return {
    id: asset.id,
    name: asset.name ?? "",
    category: asset.category_name ?? asset.category_id ?? "",
    serialNumber: asset.serial_number ?? "",
    assetTag: asset.asset_tag ?? "",
    department: asset.department_name ?? asset.department_id ?? "",
    assignedEmployee: asset.assigned_employee ?? "",
    location: asset.location ?? "",
    purchaseDate: asset.acquisition_date ?? "",
    condition: asset.asset_condition === "DAMAGED" ? "POOR" : asset.asset_condition ?? "GOOD",
    status: statusMap[asset.status] ?? "Available",
    sharedResource: Boolean(asset.is_bookable),
  }
}

function mapDepartment(department: BackendRecord): Department {
  return {
    id: department.id,
    name: department.name ?? "",
    parentDepartment: department.parent_department_id ?? "None",
    head: department.department_head ?? "",
    employeeCount: Number(department.employee_count ?? 0),
    status: department.status === "INACTIVE" ? "Archived" : "Active",
  }
}

function mapCategory(category: BackendRecord): AssetCategory {
  return {
    id: category.id,
    name: category.name ?? "",
    description: category.description ?? "",
    color: "blue",
  }
}

function mapAllocation(allocation: BackendRecord): Allocation {
  return {
    id: allocation.id,
    assetId: allocation.asset_id ?? "",
    assetName: allocation.asset_name ?? allocation.asset_id ?? "",
    employeeId: allocation.user_id ?? "",
    employeeName: allocation.user_name ?? allocation.user_id ?? "",
    department: allocation.department_name ?? "",
    allocationDate: allocation.allocated_date ?? "",
    expectedReturnDate: allocation.expected_return_date ?? "",
    status:
      allocation.status === "RETURNED"
        ? "Returned"
        : allocation.status === "OVERDUE"
          ? "Overdue"
          : "Active",
  }
}

function mapBooking(booking: BackendRecord): Booking {
  return {
    id: booking.id,
    resource: booking.asset_name ?? booking.asset_id ?? "",
    date: booking.booking_date ?? booking.date ?? "",
    startTime: booking.start_time ?? "",
    endTime: booking.end_time ?? "",
    department: booking.department_name ?? "",
    purpose: booking.purpose ?? "",
    status: booking.status
      ? booking.status.charAt(0) + booking.status.slice(1).toLowerCase()
      : "Pending",
  }
}

function mapMaintenance(request: BackendRecord): MaintenanceRequest {
  return {
    id: request.id,
    assetId: request.asset_id ?? "",
    assetName: request.asset_name ?? request.asset_id ?? "",
    description: request.issue_description ?? request.description ?? "",
    priority: request.priority
      ? request.priority.charAt(0) + request.priority.slice(1).toLowerCase()
      : "Medium",
    status:
      request.status === "IN_PROGRESS"
        ? "In Progress"
        : request.status === "COMPLETED"
          ? "Resolved"
          : request.status
            ? request.status.charAt(0) + request.status.slice(1).toLowerCase()
            : "Pending",
    technician: request.technician_name ?? "",
    createdAt: request.created_at ?? "",
  }
}

function mapAudit(audit: BackendRecord): AuditCycle {
  return {
    id: audit.id,
    name: audit.name ?? audit.title ?? "",
    scope: audit.scope ?? "",
    department: audit.department_name ?? audit.department_id ?? "All Departments",
    auditor: audit.auditor_name ?? audit.auditor_id ?? "",
    startDate: audit.start_date ?? "",
    endDate: audit.end_date ?? "",
    status:
      audit.status === "IN_PROGRESS"
        ? "In Progress"
        : audit.status
          ? audit.status.charAt(0) + audit.status.slice(1).toLowerCase()
          : "Scheduled",
  }
}

interface ERPState {
  assets: Asset[]
  employees: Employee[]
  departments: Department[]
  categories: AssetCategory[]
  allocations: Allocation[]
  bookings: Booking[]
  maintenance: MaintenanceRequest[]
  audits: AuditCycle[]
  notifications: ERPNotification[]
  activities: ERPActivity[]

  // Asset Actions
  addAsset: (asset: Omit<Asset, "id" | "assetTag">) => void
  updateAsset: (id: string, asset: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  // Employee Actions
  inviteEmployee: (employee: Omit<Employee, "id" | "invitationStatus">) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Department Actions
  addDepartment: (department: Omit<Department, "id" | "employeeCount">) => void
  updateDepartment: (id: string, department: Partial<Department>) => void
  deleteDepartment: (id: string) => void

  // Category Actions
  addCategory: (category: Omit<AssetCategory, "id">) => void
  updateCategory: (id: string, category: Partial<AssetCategory>) => void
  deleteCategory: (id: string) => void

  // Allocation Actions
  allocateAsset: (allocation: Omit<Allocation, "id" | "status" | "allocationDate">) => void
  returnAsset: (allocationId: string) => void
  transferAsset: (allocationId: string, newEmployeeId: string, newEmployeeName: string, newDepartment: string) => void

  // Booking Actions
  addBooking: (booking: Omit<Booking, "id" | "status">) => void
  updateBookingStatus: (id: string, status: Booking["status"]) => void
  rescheduleBooking: (id: string, date: string, startTime: string, endTime: string) => void

  // Maintenance Actions
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, "id" | "status" | "technician" | "createdAt">) => void
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest["status"], technician?: string) => void

  // Audit Actions
  addAuditCycle: (audit: Omit<AuditCycle, "id" | "status">) => void
  updateAuditStatus: (id: string, status: AuditCycle["status"]) => void

  // Notification Actions
  markNotificationRead: (id: string) => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void

  // Activity Helper
  addActivity: (activity: Omit<ERPActivity, "time">) => void

  // UI state
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  hydrateFromBackend: () => Promise<void>
}

export const useERPStore = create<ERPState>((set) => ({
  assets: [
    { id: "1", name: 'MacBook Pro 16"', category: "Laptops", serialNumber: "C02F28H1MD6M", assetTag: "AST-001", department: "Engineering", assignedEmployee: "Sarah Chen", location: "HQ - Floor 3", purchaseDate: "2025-01-15", condition: "GOOD", status: "Allocated", sharedResource: false },
    { id: "2", name: "Dell XPS 15", category: "Laptops", serialNumber: "38H29G1", assetTag: "AST-002", department: "Design", assignedEmployee: "Mike Ross", location: "HQ - Floor 2", purchaseDate: "2025-02-10", condition: "NEW", status: "Allocated", sharedResource: false },
    { id: "3", name: "HP LaserJet Pro", category: "Printers", serialNumber: "JPB8H2718", assetTag: "AST-003", department: "IT Support", assignedEmployee: "", location: "HQ - Copy Room", purchaseDate: "2024-06-18", condition: "FAIR", status: "Under Maintenance", sharedResource: true },
    { id: "4", name: "Standing Desk", category: "Furniture", serialNumber: "SD-92817", assetTag: "AST-004", department: "Marketing", assignedEmployee: "Lisa Park", location: "HQ - Floor 4", purchaseDate: "2024-08-20", condition: "GOOD", status: "Allocated", sharedResource: false },
    { id: "5", name: "Dell 27\" Monitor", category: "Monitors", serialNumber: "CN-098172", assetTag: "AST-005", department: "Engineering", assignedEmployee: "John Doe", location: "HQ - Floor 3", purchaseDate: "2025-01-20", condition: "NEW", status: "Available", sharedResource: false },
    { id: "6", name: "Conference Room A AV", category: "AV Equipment", serialNumber: "AV-88172", assetTag: "AST-006", department: "Product", assignedEmployee: "", location: "HQ - Conf Room A", purchaseDate: "2024-11-12", condition: "GOOD", status: "Available", sharedResource: true },
  ],
  employees: [
    { id: "1", name: "Sarah Chen", email: "sarah.chen@company.com", department: "Engineering", role: "employee", status: "Active", invitationStatus: "Accepted" },
    { id: "2", name: "Mike Ross", email: "mike.ross@company.com", department: "Design", role: "employee", status: "Active", invitationStatus: "Accepted" },
    { id: "3", name: "Lisa Park", email: "lisa.park@company.com", department: "Marketing", role: "employee", status: "Active", invitationStatus: "Accepted" },
    { id: "4", name: "John Doe", email: "john.doe@company.com", department: "Engineering", role: "employee", status: "Active", invitationStatus: "Accepted" },
    { id: "5", name: "Alex Smith", email: "alex.smith@company.com", department: "Operations", role: "asset_manager", status: "Active", invitationStatus: "Accepted" },
    { id: "6", name: "Emily Watson", email: "emily.watson@company.com", department: "Engineering", role: "department_head", status: "Active", invitationStatus: "Accepted" },
    { id: "7", name: "Robert Taylor", email: "robert.t@company.com", department: "Finance", role: "auditor", status: "Active", invitationStatus: "Pending" },
  ],
  departments: [
    { id: "1", name: "Engineering", parentDepartment: "None", head: "Emily Watson", employeeCount: 48, status: "Active" },
    { id: "2", name: "Marketing", parentDepartment: "None", head: "Lisa Park", employeeCount: 23, status: "Active" },
    { id: "3", name: "Operations", parentDepartment: "None", head: "Alex Smith", employeeCount: 35, status: "Active" },
    { id: "4", name: "Design", parentDepartment: "None", head: "Mike Ross", employeeCount: 18, status: "Active" },
    { id: "5", name: "IT Support", parentDepartment: "Operations", head: "John Doe", employeeCount: 8, status: "Active" },
  ],
  categories: [
    { id: "1", name: "Laptops", description: "All company workstation laptops", color: "blue" },
    { id: "2", name: "Printers", description: "Office printers and scanner hubs", color: "green" },
    { id: "3", name: "Furniture", description: "Desks, chairs and ergonomic items", color: "amber" },
    { id: "4", name: "Monitors", description: "Workstation displays", color: "purple" },
    { id: "5", name: "AV Equipment", description: "Conference room audio and visual setup", color: "pink" },
  ],
  allocations: [
    { id: "1", assetId: "1", assetName: 'MacBook Pro 16"', employeeId: "1", employeeName: "Sarah Chen", department: "Engineering", allocationDate: "2026-07-01", expectedReturnDate: "2027-07-01", status: "Active" },
    { id: "2", assetId: "2", assetName: "Dell XPS 15", employeeId: "2", employeeName: "Mike Ross", department: "Design", allocationDate: "2026-07-02", expectedReturnDate: "2027-07-02", status: "Active" },
    { id: "3", assetId: "4", assetName: "Standing Desk", employeeId: "3", employeeName: "Lisa Park", department: "Marketing", allocationDate: "2026-07-03", expectedReturnDate: "2027-07-03", status: "Active" },
  ],
  bookings: [
    { id: "1", resource: "Conference Room A AV", date: "2026-07-15", startTime: "14:00", endTime: "15:00", department: "Product", purpose: "Sprint Planning", status: "Approved" },
    { id: "2", resource: "Projector HD", date: "2026-07-16", startTime: "10:00", endTime: "12:00", department: "Marketing", purpose: "Campaign Launch", status: "Pending" },
  ],
  maintenance: [
    { id: "1", assetId: "3", assetName: "HP LaserJet Pro", description: "Paper jam issue & toner replacement", priority: "High", status: "Pending", technician: "", createdAt: "2026-07-12" },
  ],
  audits: [
    { id: "1", name: "Q4 Asset Verification", scope: "Full Company", department: "All Departments", auditor: "Robert Taylor", startDate: "2026-12-01", endDate: "2026-12-15", status: "Scheduled" },
  ],
  notifications: [
    { id: "1", title: "New Asset Registered", description: "Dell 27\" Monitor was added by John Doe", time: "5 min ago", read: false, category: "info" },
    { id: "2", title: "Maintenance Request High Priority", description: "HP LaserJet Pro requires immediate repair", time: "30 min ago", read: false, category: "alert" },
    { id: "3", title: "Audit Cycle Approaching", description: "Q4 Asset Verification starts soon", time: "2 hours ago", read: true, category: "info" },
  ],
  activities: [
    { initials: "JD", action: "allocated", entity: "MacBook Pro 16\"", target: "Sarah Chen", department: "Engineering", time: "5 min ago", type: "allocation" },
    { initials: "SC", action: "completed maintenance on", entity: "HP LaserJet Pro", department: "IT Support", time: "23 min ago", type: "maintenance" },
    { initials: "MR", action: "booked", entity: "Conference Room A", department: "Product", time: "1h ago", type: "booking" },
  ],

  // Actions implementation
  addAsset: (asset) => set((state) => {
    const newId = (state.assets.length + 1).toString()
    const assetTag = `AST-${newId.padStart(3, "0")}`
    const newAsset: Asset = { ...asset, id: newId, assetTag }
    
    // Add activity
    const activity: ERPActivity = {
      initials: "AD",
      action: "registered new asset",
      entity: asset.name,
      department: asset.department || "Operations",
      time: "Just now",
      type: "asset",
    }
    
    // Add notification
    const notification: ERPNotification = {
      id: Math.random().toString(),
      title: "Asset Registered",
      description: `${asset.name} was successfully registered.`,
      time: "Just now",
      read: false,
      category: "info",
    }

    return {
      assets: [newAsset, ...state.assets],
      activities: [activity, ...state.activities],
      notifications: [notification, ...state.notifications],
    }
  }),

  updateAsset: (id, updatedFields) => set((state) => ({
    assets: state.assets.map((asset) => asset.id === id ? { ...asset, ...updatedFields } : asset)
  })),

  deleteAsset: (id) => set((state) => {
    const asset = state.assets.find((a) => a.id === id)
    return {
      assets: state.assets.filter((asset) => asset.id !== id),
      activities: asset ? [{ initials: "AD", action: "deleted asset", entity: asset.name, department: asset.department || "Operations", time: "Just now", type: "asset" }, ...state.activities] : state.activities
    }
  }),

  inviteEmployee: (employee) => set((state) => {
    const newId = (state.employees.length + 1).toString()
    const newEmployee: Employee = { ...employee, id: newId, invitationStatus: "Pending" }
    
    return {
      employees: [...state.employees, newEmployee],
      activities: [{ initials: "AD", action: "invited employee", entity: employee.name, department: employee.department, time: "Just now", type: "employee" }, ...state.activities]
    }
  }),

  updateEmployee: (id, updatedFields) => set((state) => ({
    employees: state.employees.map((emp) => emp.id === id ? { ...emp, ...updatedFields } : emp)
  })),

  deleteEmployee: (id) => set((state) => ({
    employees: state.employees.filter((emp) => emp.id !== id)
  })),

  addDepartment: (dept) => set((state) => {
    const newId = (state.departments.length + 1).toString()
    const newDept: Department = { ...dept, id: newId, employeeCount: 0 }
    
    return {
      departments: [...state.departments, newDept],
      activities: [{ initials: "AD", action: "created department", entity: dept.name, department: dept.name, time: "Just now", type: "department" }, ...state.activities]
    }
  }),

  updateDepartment: (id, updatedFields) => set((state) => ({
    departments: state.departments.map((dept) => dept.id === id ? { ...dept, ...updatedFields } : dept)
  })),

  deleteDepartment: (id) => set((state) => ({
    departments: state.departments.filter((dept) => dept.id !== id)
  })),

  addCategory: (cat) => set((state) => {
    const newId = (state.categories.length + 1).toString()
    const newCat: AssetCategory = { ...cat, id: newId }
    
    return {
      categories: [...state.categories, newCat]
    }
  }),

  updateCategory: (id, updatedFields) => set((state) => ({
    categories: state.categories.map((cat) => cat.id === id ? { ...cat, ...updatedFields } : cat)
  })),

  deleteCategory: (id) => set((state) => ({
    categories: state.categories.filter((cat) => cat.id !== id)
  })),

  allocateAsset: (allocation) => set((state) => {
    const newId = (state.allocations.length + 1).toString()
    const newAllocation: Allocation = {
      ...allocation,
      id: newId,
      status: "Active",
      allocationDate: new Date().toISOString().split("T")[0]
    }

    // Update the asset status & assignment
    const updatedAssets = state.assets.map((asset) =>
      asset.id === allocation.assetId
        ? { ...asset, status: "Allocated" as const, assignedEmployee: allocation.employeeName, department: allocation.department }
        : asset
    )

    return {
      allocations: [newAllocation, ...state.allocations],
      assets: updatedAssets,
      activities: [{
        initials: "AD",
        action: "allocated",
        entity: allocation.assetName,
        target: allocation.employeeName,
        department: allocation.department,
        time: "Just now",
        type: "allocation"
      }, ...state.activities]
    }
  }),

  returnAsset: (allocationId) => set((state) => {
    const allocation = state.allocations.find((a) => a.id === allocationId)
    if (!allocation) return {}

    // Update allocation status to returned
    const updatedAllocations = state.allocations.map((a) =>
      a.id === allocationId ? { ...a, status: "Returned" as const } : a
    )

    // Update asset status to Available
    const updatedAssets = state.assets.map((asset) =>
      asset.id === allocation.assetId
        ? { ...asset, status: "Available" as const, assignedEmployee: "", department: "" }
        : asset
    )

    return {
      allocations: updatedAllocations,
      assets: updatedAssets,
      activities: [{
        initials: "AD",
        action: "processed return of",
        entity: allocation.assetName,
        target: allocation.employeeName,
        department: allocation.department,
        time: "Just now",
        type: "allocation"
      }, ...state.activities]
    }
  }),

  transferAsset: (allocationId, newEmployeeId, newEmployeeName, newDepartment) => set((state) => {
    const allocation = state.allocations.find((a) => a.id === allocationId)
    if (!allocation) return {}

    // Update the allocation
    const updatedAllocations = state.allocations.map((a) =>
      a.id === allocationId
        ? { ...a, employeeId: newEmployeeId, employeeName: newEmployeeName, department: newDepartment }
        : a
    )

    // Update the asset assignment
    const updatedAssets = state.assets.map((asset) =>
      asset.id === allocation.assetId
        ? { ...asset, assignedEmployee: newEmployeeName, department: newDepartment }
        : asset
    )

    return {
      allocations: updatedAllocations,
      assets: updatedAssets,
      activities: [{
        initials: "AD",
        action: "transferred",
        entity: allocation.assetName,
        target: newEmployeeName,
        department: newDepartment,
        time: "Just now",
        type: "allocation"
      }, ...state.activities]
    }
  }),

  addBooking: (booking) => set((state) => {
    const newId = (state.bookings.length + 1).toString()
    const newBooking: Booking = { ...booking, id: newId, status: "Approved" }

    return {
      bookings: [newBooking, ...state.bookings],
      activities: [{
        initials: "AD",
        action: "booked resource",
        entity: booking.resource,
        department: booking.department,
        time: "Just now",
        type: "booking"
      }, ...state.activities]
    }
  }),

  updateBookingStatus: (id, status) => set((state) => ({
    bookings: state.bookings.map((b) => b.id === id ? { ...b, status } : b)
  })),

  rescheduleBooking: (id, date, startTime, endTime) => set((state) => ({
    bookings: state.bookings.map((b) => b.id === id ? { ...b, date, startTime, endTime } : b)
  })),

  addMaintenanceRequest: (req) => set((state) => {
    const newId = (state.maintenance.length + 1).toString()
    const newReq: MaintenanceRequest = {
      ...req,
      id: newId,
      status: "Pending",
      technician: "",
      createdAt: new Date().toISOString().split("T")[0]
    }

    // Mark asset status as under maintenance
    const updatedAssets = state.assets.map((asset) =>
      asset.id === req.assetId
        ? { ...asset, status: "Under Maintenance" as const }
        : asset
    )

    return {
      maintenance: [newReq, ...state.maintenance],
      assets: updatedAssets,
      activities: [{
        initials: "AD",
        action: "requested maintenance for",
        entity: req.assetName,
        department: "Operations",
        time: "Just now",
        type: "maintenance"
      }, ...state.activities]
    }
  }),

  updateMaintenanceStatus: (id, status, technician) => set((state) => {
    const req = state.maintenance.find((m) => m.id === id)
    if (!req) return {}

    const updatedRequests = state.maintenance.map((m) =>
      m.id === id ? { ...m, status, ...(technician ? { technician } : {}) } : m
    )

    // If resolved, return asset to Available
    let updatedAssets = state.assets
    if (status === "Resolved") {
      updatedAssets = state.assets.map((asset) =>
        asset.id === req.assetId
          ? { ...asset, status: "Available" as const }
          : asset
      )
    } else if (status === "Rejected") {
      updatedAssets = state.assets.map((asset) =>
        asset.id === req.assetId
          ? { ...asset, status: "Available" as const }
          : asset
      )
    }

    return {
      maintenance: updatedRequests,
      assets: updatedAssets,
      activities: [{
        initials: "AD",
        action: `updated maintenance status of`,
        entity: req.assetName,
        target: status,
        department: "Operations",
        time: "Just now",
        type: "maintenance"
      }, ...state.activities]
    }
  }),

  addAuditCycle: (audit) => set((state) => {
    const newId = (state.audits.length + 1).toString()
    const newAudit: AuditCycle = { ...audit, id: newId, status: "Scheduled" }

    return {
      audits: [newAudit, ...state.audits],
      activities: [{
        initials: "AD",
        action: "created audit cycle",
        entity: audit.name,
        department: audit.department,
        time: "Just now",
        type: "audit"
      }, ...state.activities]
    }
  }),

  updateAuditStatus: (id, status) => set((state) => ({
    audits: state.audits.map((a) => a.id === id ? { ...a, status } : a)
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  clearAllNotifications: () => set({ notifications: [] }),

  addActivity: (act) => set((state) => ({
    activities: [{ ...act, time: "Just now" }, ...state.activities]
  })),

  // UI state
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  hydrateFromBackend: async () => {
    const [
      assets,
      departments,
      categories,
      allocations,
      bookings,
      maintenance,
      audits,
    ] = await Promise.all([
      apiRequest<BackendRecord[]>("/assets"),
      apiRequest<BackendRecord[]>("/departments"),
      apiRequest<BackendRecord[]>("/asset-categories"),
      apiRequest<BackendRecord[]>("/allocations"),
      apiRequest<BackendRecord[]>("/resource-bookings"),
      apiRequest<BackendRecord[]>("/maintenance"),
      apiRequest<BackendRecord[]>("/audits"),
    ])

    set({
      assets: assets.map(mapAsset),
      departments: departments.map(mapDepartment),
      categories: categories.map(mapCategory),
      allocations: allocations.map(mapAllocation),
      bookings: bookings.map(mapBooking),
      maintenance: maintenance.map(mapMaintenance),
      audits: audits.map(mapAudit),
    })
  },
}))
