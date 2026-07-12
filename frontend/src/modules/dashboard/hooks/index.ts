"use client"

export function useDashboard() {

  return {
    getStats: async () => ({ totalAssets: 0, allocatedAssets: 0, availableAssets: 0, maintenanceAssets: 0, totalEmployees: 0, totalDepartments: 0, pendingRequests: 0, upcomingAudits: 0 }),
    getRecentActivity: async () => [],
    getChartData: async () => [],
  }
}