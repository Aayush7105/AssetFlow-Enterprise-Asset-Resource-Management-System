export interface Booking {
  id: string
  assetId: string
  assetName: string
  bookedById: string
  bookedByName: string
  departmentId: string
  departmentName: string
  startDate: string
  endDate: string
  purpose: string
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled"
  approvedById?: string
  approvedByName?: string
  createdAt: string
}
