export interface MaintenanceRequest {
  id: string
  assetId: string
  assetName: string
  assetCode: string
  requestedById: string
  requestedByName: string
  type: "preventive" | "corrective" | "emergency"
  priority: "low" | "medium" | "high" | "critical"
  description: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  scheduledDate?: string
  completedDate?: string
  cost?: number
  vendor?: string
  notes?: string
  createdAt: string
}
