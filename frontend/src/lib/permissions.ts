import { type UserRole } from "@/lib/constants";

type PermissionMap = Record<UserRole, string[]>;

export const PERMISSIONS: PermissionMap = {
  admin: ["*"],
  asset_manager: [
    "dashboard",
    "assets",
    "allocations",
    "bookings",
    "maintenance",
    "audits",
    "reports",
    "notifications",
    "settings",
  ],
  department_head: [
    "dashboard",
    "assets",
    "allocations",
    "bookings",
    "maintenance",
    "notifications",
  ],
  employee: ["dashboard", "assets", "bookings", "notifications"],
};

export function hasPermission(role: UserRole, module: string): boolean {
  const allowed = PERMISSIONS[role];
  if (allowed.includes("*")) return true;
  return allowed.includes(module);
}