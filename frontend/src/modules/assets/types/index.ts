export interface Asset {
  id: string
  name: string
  code: string
  categoryId: string
  categoryName: string
  departmentId?: string
  departmentName?: string
  status: "available" | "allocated" | "in_maintenance" | "disposed"
  purchaseDate?: string
  purchaseCost?: number
  currentValue?: number
  location?: string
  description?: string
  assignedTo?: string
  assignedToName?: string
  warrantyExpiry?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AssetFilter {
  status?: Asset["status"]
  categoryId?: string
  departmentId?: string
  search?: string
}
