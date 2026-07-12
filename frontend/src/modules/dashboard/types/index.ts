export interface DashboardStats {
  totalAssets: number
  allocatedAssets: number
  availableAssets: number
  maintenanceAssets: number
  totalEmployees: number
  totalDepartments: number
  pendingRequests: number
  upcomingAudits: number
}

export interface RecentActivity {
  id: string
  type: "allocation" | "return" | "maintenance" | "audit" | "booking"
  title: string
  description: string
  user: string
  timestamp: string
}

export interface ChartDataPoint {
  label: string
  value: number
}
