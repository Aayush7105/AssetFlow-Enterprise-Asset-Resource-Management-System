export interface Allocation {
  id: string
  assetId: string
  assetName: string
  assetCode: string
  assignedToId: string
  assignedToName: string
  departmentId: string
  departmentName: string
  allocatedById: string
  allocatedByName: string
  allocatedDate: string
  returnDate?: string
  status: "active" | "returned" | "overdue"
  notes?: string
}
