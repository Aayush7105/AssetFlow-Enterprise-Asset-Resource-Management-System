import { assetService } from "@/modules/assets/services"
import { allocationService } from "@/modules/allocations/services"
import { bookingService } from "@/modules/bookings/services"
import { maintenanceService } from "@/modules/maintenance/services"

export const dashboardService = {
  getStats: async () => {
    const [assets, allocations, bookings, maintenance] = await Promise.all([
      assetService.getAssets(),
      allocationService.getAllocations(),
      bookingService.getBookings(),
      maintenanceService.getRequests(),
    ])

    return {
      assets: assets.length,
      allocations: allocations.length,
      bookings: bookings.length,
      maintenance: maintenance.length,
    }
  },
  getRecentActivity: async () => {
    return []
  },
  getChartData: async () => {
    return []
  },
}
