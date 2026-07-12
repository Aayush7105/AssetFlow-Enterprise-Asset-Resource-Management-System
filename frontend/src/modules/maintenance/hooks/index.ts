"use client"

import { maintenanceService } from "@/modules/maintenance/services"

export function useMaintenance() {
  return maintenanceService
}
