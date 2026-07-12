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
type MaybePromise<T> = T | Promise<T>

const roleToBackend: Record<string, string> = {
  admin: "ADMIN",
  asset_manager: "ASSET_MANAGER",
  department_head: "DEPARTMENT_HEAD",
  auditor: "AUDITOR",
  employee: "EMPLOYEE",
}

const roleToUi: Record<string, string> = {
  ADMIN: "admin",
  ASSET_MANAGER: "asset_manager",
  DEPARTMENT_HEAD: "department_head",
  AUDITOR: "auditor",
  EMPLOYEE: "employee",
}

function toDate(value?: string) {
  return value ? value.slice(0, 10) : ""
}

function toDateTime(date?: string, time?: string) {
  return date && time ? `${date}T${time}:00` : undefined
}

function departmentCode(name: string) {
  return name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 30) || "DEPT"
}

function statusToBackend(status?: Asset["status"]) {
  switch (status) {
    case "Allocated":
      return "ALLOCATED"
    case "Under Maintenance":
      return "UNDER_MAINTENANCE"
    case "Disposed":
      return "DISPOSED"
    default:
      return "AVAILABLE"
  }
}

function conditionToBackend(condition?: Asset["condition"]) {
  return condition === "POOR" ? "DAMAGED" : condition || "GOOD"
}

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
    assignedEmployee: asset.assigned_employee ?? asset.employee_name ?? "",
    location: asset.location ?? "",
    purchaseDate: toDate(asset.acquisition_date),
    condition: asset.asset_condition === "DAMAGED" ? "POOR" : asset.asset_condition ?? "GOOD",
    status: statusMap[asset.status] ?? "Available",
    sharedResource: Boolean(asset.is_bookable),
  }
}

function mapEmployee(user: BackendRecord): Employee {
  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    department: user.department_name ?? user.department_id ?? "",
    role: roleToUi[user.role] ?? "employee",
    status: user.status === "INACTIVE" ? "Inactive" : "Active",
    invitationStatus: user.is_first_login ? "Pending" : "Accepted",
  }
}

function mapDepartment(department: BackendRecord): Department {
  return {
    id: department.id,
    name: department.name ?? "",
    parentDepartment: department.parent_department_name ?? department.parent_department_id ?? "None",
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
    employeeName: allocation.employee_name ?? allocation.user_name ?? allocation.user_id ?? "",
    department: allocation.department_name ?? "",
    allocationDate: toDate(allocation.allocated_date ?? allocation.created_at),
    expectedReturnDate: toDate(allocation.expected_return_date),
    status: allocation.status === "RETURNED" ? "Returned" : allocation.status === "OVERDUE" ? "Overdue" : "Active",
  }
}

function mapBooking(booking: BackendRecord): Booking {
  const start = booking.start_time ? new Date(booking.start_time) : null
  const end = booking.end_time ? new Date(booking.end_time) : null
  const date = start && !Number.isNaN(start.valueOf()) ? start.toISOString().slice(0, 10) : ""
  const startTime = start && !Number.isNaN(start.valueOf()) ? start.toTimeString().slice(0, 5) : ""
  const endTime = end && !Number.isNaN(end.valueOf()) ? end.toTimeString().slice(0, 5) : ""

  return {
    id: booking.id,
    resource: booking.asset_name ?? booking.asset_id ?? "",
    date,
    startTime,
    endTime,
    department: booking.department_name ?? "",
    purpose: booking.purpose ?? booking.title ?? "",
    status: booking.status === "CANCELLED" ? "Cancelled" : booking.status === "COMPLETED" ? "Completed" : "Approved",
  }
}

function mapMaintenance(request: BackendRecord): MaintenanceRequest {
  const statusMap: Record<string, MaintenanceRequest["status"]> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    TECHNICIAN_ASSIGNED: "Approved",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
  }

  return {
    id: request.id,
    assetId: request.asset_id ?? "",
    assetName: request.asset_name ?? request.asset_id ?? "",
    description: request.issue ?? request.issue_description ?? request.description ?? "",
    priority: request.priority ? request.priority.charAt(0) + request.priority.slice(1).toLowerCase() : "Medium",
    status: statusMap[request.status] ?? "Pending",
    technician: request.technician_name ?? "",
    createdAt: toDate(request.created_at ?? request.requested_at),
  }
}

function mapAudit(audit: BackendRecord): AuditCycle {
  return {
    id: audit.id,
    name: audit.title ?? audit.name ?? "",
    scope: audit.department_id ? "Department Only" : "Full Company",
    department: audit.department_name ?? audit.department_id ?? "All Departments",
    auditor: audit.auditor_name ?? "",
    startDate: toDate(audit.start_date),
    endDate: toDate(audit.end_date),
    status: audit.status === "CLOSED" ? "Completed" : audit.status === "IN_PROGRESS" ? "In Progress" : "Scheduled",
  }
}

function mapActivity(activity: BackendRecord): ERPActivity {
  const userName = activity.user_name ?? "System"
  return {
    initials: userName.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase() || "SY",
    action: activity.action ?? "updated",
    entity: activity.entity_type ?? "record",
    target: activity.description,
    department: "",
    time: toDate(activity.created_at) || "Just now",
    type: String(activity.entity_type ?? activity.action ?? "activity").toLowerCase(),
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
  addAsset: (asset: Omit<Asset, "id" | "assetTag">) => MaybePromise<void>
  updateAsset: (id: string, asset: Partial<Asset>) => MaybePromise<void>
  deleteAsset: (id: string) => MaybePromise<void>
  inviteEmployee: (employee: Omit<Employee, "id" | "invitationStatus">) => MaybePromise<void>
  updateEmployee: (id: string, employee: Partial<Employee>) => MaybePromise<void>
  deleteEmployee: (id: string) => MaybePromise<void>
  addDepartment: (department: Omit<Department, "id" | "employeeCount">) => MaybePromise<void>
  updateDepartment: (id: string, department: Partial<Department>) => MaybePromise<void>
  deleteDepartment: (id: string) => MaybePromise<void>
  addCategory: (category: Omit<AssetCategory, "id">) => MaybePromise<void>
  updateCategory: (id: string, category: Partial<AssetCategory>) => MaybePromise<void>
  deleteCategory: (id: string) => MaybePromise<void>
  allocateAsset: (allocation: Omit<Allocation, "id" | "status" | "allocationDate">) => MaybePromise<void>
  returnAsset: (allocationId: string) => MaybePromise<void>
  transferAsset: (allocationId: string, newEmployeeId: string, newEmployeeName: string, newDepartment: string) => MaybePromise<void>
  addBooking: (booking: Omit<Booking, "id" | "status">) => MaybePromise<void>
  updateBookingStatus: (id: string, status: Booking["status"]) => MaybePromise<void>
  rescheduleBooking: (id: string, date: string, startTime: string, endTime: string) => MaybePromise<void>
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, "id" | "status" | "technician" | "createdAt">) => MaybePromise<void>
  updateMaintenanceStatus: (id: string, status: MaintenanceRequest["status"], technician?: string) => MaybePromise<void>
  addAuditCycle: (audit: Omit<AuditCycle, "id" | "status">) => MaybePromise<void>
  updateAuditStatus: (id: string, status: AuditCycle["status"]) => MaybePromise<void>
  markNotificationRead: (id: string) => void
  deleteNotification: (id: string) => void
  clearAllNotifications: () => void
  addActivity: (activity: Omit<ERPActivity, "time">) => void
  isCommandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  hydrateFromBackend: () => Promise<void>
}

export const useERPStore = create<ERPState>((set, get) => ({
  assets: [],
  employees: [],
  departments: [],
  categories: [],
  allocations: [],
  bookings: [],
  maintenance: [],
  audits: [],
  notifications: [],
  activities: [],

  addAsset: async (asset) => {
    const category = get().categories.find((item) => item.name === asset.category || item.id === asset.category)
    const department = get().departments.find((item) => item.name === asset.department || item.id === asset.department)

    await apiRequest("/assets", {
      method: "POST",
      body: {
        name: asset.name,
        category_id: category?.id ?? asset.category,
        department_id: department?.id || null,
        serial_number: asset.serialNumber || null,
        acquisition_date: asset.purchaseDate || null,
        acquisition_cost: null,
        asset_condition: conditionToBackend(asset.condition),
        location: asset.location || null,
        is_bookable: asset.sharedResource,
      },
    })
    await get().hydrateFromBackend()
  },

  updateAsset: async (id, updatedFields) => {
    const current = get().assets.find((asset) => asset.id === id)
    if (!current) return
    const next = { ...current, ...updatedFields }
    const category = get().categories.find((item) => item.name === next.category || item.id === next.category)
    const department = get().departments.find((item) => item.name === next.department || item.id === next.department)

    await apiRequest(`/assets/${id}`, {
      method: "PUT",
      body: {
        name: next.name,
        category_id: category?.id ?? next.category,
        department_id: department?.id || null,
        serial_number: next.serialNumber || null,
        acquisition_date: next.purchaseDate || null,
        acquisition_cost: null,
        asset_condition: conditionToBackend(next.condition),
        location: next.location || null,
        is_bookable: next.sharedResource,
        status: statusToBackend(next.status),
      },
    })
    await get().hydrateFromBackend()
  },

  deleteAsset: async (id) => {
    await apiRequest(`/assets/${id}`, { method: "DELETE" })
    await get().hydrateFromBackend()
  },

  inviteEmployee: async (employee) => {
    const department = get().departments.find((item) => item.name === employee.department || item.id === employee.department)
    await apiRequest("/users", {
      method: "POST",
      body: {
        name: employee.name,
        email: employee.email,
        phone: null,
        department_id: department?.id || null,
        role: roleToBackend[employee.role] ?? "EMPLOYEE",
      },
    })
    await get().hydrateFromBackend()
  },

  updateEmployee: async (id, updatedFields) => {
    const current = get().employees.find((employee) => employee.id === id)
    if (!current) return
    const next = { ...current, ...updatedFields }
    const department = get().departments.find((item) => item.name === next.department || item.id === next.department)
    await apiRequest(`/users/${id}`, {
      method: "PUT",
      body: {
        name: next.name,
        email: next.email,
        phone: null,
        department_id: department?.id || null,
        status: next.status === "Inactive" ? "INACTIVE" : "ACTIVE",
        role: roleToBackend[next.role] ?? "EMPLOYEE",
      },
    })
    await get().hydrateFromBackend()
  },

  deleteEmployee: async (id) => {
    await apiRequest(`/users/${id}`, { method: "DELETE" })
    await get().hydrateFromBackend()
  },

  addDepartment: async (dept) => {
    const parent = get().departments.find((item) => item.name === dept.parentDepartment || item.id === dept.parentDepartment)
    const head = get().employees.find((item) => item.name === dept.head || item.id === dept.head)
    await apiRequest("/departments", {
      method: "POST",
      body: {
        name: dept.name,
        code: departmentCode(dept.name),
        parent_department_id: parent?.id || null,
        head_user_id: head?.id || null,
      },
    })
    await get().hydrateFromBackend()
  },

  updateDepartment: async (id, updatedFields) => {
    const current = get().departments.find((department) => department.id === id)
    if (!current) return
    const next = { ...current, ...updatedFields }
    const parent = get().departments.find((item) => item.name === next.parentDepartment || item.id === next.parentDepartment)
    const head = get().employees.find((item) => item.name === next.head || item.id === next.head)
    await apiRequest(`/departments/${id}`, {
      method: "PUT",
      body: {
        name: next.name,
        code: departmentCode(next.name),
        parent_department_id: parent?.id || null,
        head_user_id: head?.id || null,
        status: next.status === "Archived" ? "INACTIVE" : "ACTIVE",
      },
    })
    await get().hydrateFromBackend()
  },

  deleteDepartment: async (id) => {
    await apiRequest(`/departments/${id}`, { method: "DELETE" })
    await get().hydrateFromBackend()
  },

  addCategory: async (category) => {
    await apiRequest("/asset-categories", {
      method: "POST",
      body: { name: category.name, description: category.description, extra_fields_schema: {} },
    })
    await get().hydrateFromBackend()
  },

  updateCategory: async (id, updatedFields) => {
    const current = get().categories.find((category) => category.id === id)
    if (!current) return
    const next = { ...current, ...updatedFields }
    await apiRequest(`/asset-categories/${id}`, {
      method: "PUT",
      body: { name: next.name, description: next.description, extra_fields_schema: {}, status: "ACTIVE" },
    })
    await get().hydrateFromBackend()
  },

  deleteCategory: async (id) => {
    await apiRequest(`/asset-categories/${id}`, { method: "DELETE" })
    await get().hydrateFromBackend()
  },

  allocateAsset: async (allocation) => {
    await apiRequest("/allocations", {
      method: "POST",
      body: {
        asset_id: allocation.assetId,
        user_id: allocation.employeeId,
        expected_return_date: allocation.expectedReturnDate || null,
        notes: null,
      },
    })
    await get().hydrateFromBackend()
  },

  returnAsset: async (allocationId) => {
    await apiRequest(`/allocations/${allocationId}/return`, {
      method: "PUT",
      body: { condition_notes: null },
    })
    await get().hydrateFromBackend()
  },

  transferAsset: async (allocationId, newEmployeeId) => {
    const allocation = get().allocations.find((item) => item.id === allocationId)
    if (!allocation) return
    await apiRequest(`/allocations/${allocationId}/return`, {
      method: "PUT",
      body: { condition_notes: "Transferred to another employee." },
    })
    await apiRequest("/allocations", {
      method: "POST",
      body: {
        asset_id: allocation.assetId,
        user_id: newEmployeeId,
        expected_return_date: allocation.expectedReturnDate || null,
        notes: "Transferred from previous allocation.",
      },
    })
    await get().hydrateFromBackend()
  },

  addBooking: async (booking) => {
    const asset = get().assets.find((item) => item.name === booking.resource || item.id === booking.resource)
    if (!asset) throw new Error("Please select a backend asset to book.")
    await apiRequest("/resource-bookings", {
      method: "POST",
      body: {
        asset_id: asset.id,
        title: booking.purpose || `Booking for ${asset.name}`,
        purpose: booking.purpose,
        start_time: toDateTime(booking.date, booking.startTime),
        end_time: toDateTime(booking.date, booking.endTime),
      },
    })
    await get().hydrateFromBackend()
  },

  updateBookingStatus: async (id, status) => {
    if (status === "Cancelled" || status === "Rejected") {
      await apiRequest(`/resource-bookings/${id}/cancel`, { method: "PUT" })
    } else if (status === "Completed") {
      await apiRequest(`/resource-bookings/${id}/complete`, { method: "PUT" })
    }
    await get().hydrateFromBackend()
  },

  rescheduleBooking: async (id, date, startTime, endTime) => {
    const booking = get().bookings.find((item) => item.id === id)
    if (!booking) return
    await apiRequest(`/resource-bookings/${id}`, {
      method: "PUT",
      body: {
        title: booking.purpose || `Booking for ${booking.resource}`,
        purpose: booking.purpose,
        start_time: toDateTime(date, startTime),
        end_time: toDateTime(date, endTime),
      },
    })
    await get().hydrateFromBackend()
  },

  addMaintenanceRequest: async (request) => {
    await apiRequest("/maintenance", {
      method: "POST",
      body: {
        asset_id: request.assetId,
        issue: request.description,
        priority: request.priority.toUpperCase(),
      },
    })
    await get().hydrateFromBackend()
  },

  updateMaintenanceStatus: async (id, status, technician) => {
    if (status === "Approved") {
      await apiRequest(`/maintenance/${id}/approve`, { method: "PUT" })
    } else if (status === "Rejected") {
      await apiRequest(`/maintenance/${id}/reject`, { method: "PUT" })
    } else if (status === "In Progress") {
      const tech = get().employees.find((employee) => employee.id === technician || employee.name === technician)
      if (!tech) throw new Error("Select an existing backend user as technician.")
      await apiRequest(`/maintenance/${id}/assign`, { method: "PUT", body: { technician_id: tech.id } })
      await apiRequest(`/maintenance/${id}/start`, { method: "PUT" })
    } else if (status === "Resolved") {
      await apiRequest(`/maintenance/${id}/resolve`, {
        method: "PUT",
        body: { resolution_notes: "Resolved from frontend." },
      })
    }
    await get().hydrateFromBackend()
  },

  addAuditCycle: async (audit) => {
    const department = get().departments.find((item) => item.name === audit.department || item.id === audit.department)
    const auditor = get().employees.find((item) => item.name === audit.auditor || item.id === audit.auditor)
    const created = await apiRequest<BackendRecord>("/audits", {
      method: "POST",
      body: {
        title: audit.name,
        department_id: audit.department === "All Departments" ? null : department?.id || null,
        location: audit.scope,
        start_date: audit.startDate,
        end_date: audit.endDate,
      },
    })
    if (auditor?.id && created?.id) {
      await apiRequest(`/audits/${created.id}/assign`, { method: "PUT", body: { auditor_id: auditor.id } })
    }
    await get().hydrateFromBackend()
  },

  updateAuditStatus: async (id, status) => {
    if (status === "Completed" || status === "Cancelled") {
      await apiRequest(`/audits/${id}/close`, { method: "PUT" })
    } else {
      set((state) => ({ audits: state.audits.map((audit) => audit.id === id ? { ...audit, status } : audit) }))
      return
    }
    await get().hydrateFromBackend()
  },

  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
  deleteNotification: (id) => set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
  clearAllNotifications: () => set({ notifications: [] }),
  addActivity: (act) => set((state) => ({ activities: [{ ...act, time: "Just now" }, ...state.activities] })),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),
  hydrateFromBackend: async () => {
    const [assets, departments, categories, users, allocations, bookings, maintenance, audits, activities] = await Promise.all([
      apiRequest<BackendRecord[]>("/assets"),
      apiRequest<BackendRecord[]>("/departments"),
      apiRequest<BackendRecord[]>("/asset-categories"),
      apiRequest<BackendRecord[]>("/users").catch(() => []),
      apiRequest<BackendRecord[]>("/allocations"),
      apiRequest<BackendRecord[]>("/resource-bookings"),
      apiRequest<BackendRecord[]>("/maintenance"),
      apiRequest<BackendRecord[]>("/audits"),
      apiRequest<BackendRecord[]>("/activity-logs").catch(() => []),
    ])

    set({
      assets: assets.map(mapAsset),
      departments: departments.map(mapDepartment),
      categories: categories.map(mapCategory),
      employees: users.map(mapEmployee),
      allocations: allocations.map(mapAllocation),
      bookings: bookings.map(mapBooking),
      maintenance: maintenance.map(mapMaintenance),
      audits: audits.map(mapAudit),
      activities: activities.map(mapActivity),
    })
  },
}))
