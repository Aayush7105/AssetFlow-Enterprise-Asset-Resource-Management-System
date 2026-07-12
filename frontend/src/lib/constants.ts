export const APP_NAME = "AssetFlow"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER_COMPANY: "/register-company",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
  ONBOARDING: "/onboarding",
  COMPANY: "/onboarding/company",
  ASSET_CATEGORIES: "/onboarding/asset-categories",
  DEPARTMENTS: "/onboarding/departments",
  EMPLOYEES: "/onboarding/employees",
  REVIEW: "/onboarding/review",
  DASHBOARD: "/dashboard",
  ASSETS: "/assets",
  ALLOCATIONS: "/allocations",
  BOOKINGS: "/bookings",
  MAINTENANCE: "/maintenance",
  AUDITS: "/audits",
  REPORTS: "/reports",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",
  HELP: "/help",
  ORGANIZATION_EMPLOYEES: "/organization/employees",
  ORGANIZATION_DEPARTMENTS: "/organization/departments",
  ORGANIZATION_ROLES: "/organization/roles",
  ORGANIZATION_ASSET_CATEGORIES: "/organization/asset-categories",
} as const

export const ROLES = [
  "ADMIN",
  "MANAGER",
  "EMPLOYEE",
  "VIEWER",
] as const

export type Role = (typeof ROLES)[number]

export type UserRole = "admin" | "asset_manager" | "department_head" | "employee"

export const ASSET_CONDITIONS = ["NEW", "GOOD", "FAIR", "POOR", "DISPOSED"] as const
export type AssetCondition = (typeof ASSET_CONDITIONS)[number]

export const ALLOCATION_STATUS = ["ACTIVE", "RETURNED", "OVERDUE", "EXPIRED"] as const
export type AllocationStatus = (typeof ALLOCATION_STATUS)[number]

export const MAINTENANCE_STATUS = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const
export type MaintenanceStatus = (typeof MAINTENANCE_STATUS)[number]

export const BOOKING_STATUS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"] as const
export type BookingStatus = (typeof BOOKING_STATUS)[number]

export const AUDIT_STATUS = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const
export type AuditStatus = (typeof AUDIT_STATUS)[number]
