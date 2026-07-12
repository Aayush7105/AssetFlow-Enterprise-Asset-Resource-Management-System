export interface Audit {
  id: string
  title: string
  type: "full" | "partial" | "spot"
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  assignedToId: string
  assignedToName: string
  startDate: string
  endDate?: string
  departmentId?: string
  departmentName?: string
  totalAssets: number
  verifiedAssets: number
  discrepancies: number
  notes?: string
  createdAt: string
}
