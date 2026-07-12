export const MOCK_AUDITS = [
  {
    id: "1",
    title: "Q1 Full Asset Audit",
    type: "full",
    status: "in_progress",
    assignedToName: "Emily Clark",
    departmentName: "All Departments",
    startDate: "2024-03-01",
    totalAssets: 1247,
    verifiedAssets: 834,
    discrepancies: 12,
  },
  {
    id: "2",
    title: "IT Equipment Spot Check",
    type: "spot",
    status: "scheduled",
    assignedToName: "John Doe",
    departmentName: "IT Infrastructure",
    startDate: "2024-03-25",
    totalAssets: 156,
    verifiedAssets: 0,
    discrepancies: 0,
  },
  {
    id: "3",
    title: "Furniture Inventory Review",
    type: "partial",
    status: "completed",
    assignedToName: "Jane Smith",
    departmentName: "Operations",
    startDate: "2024-02-15",
    endDate: "2024-02-28",
    totalAssets: 89,
    verifiedAssets: 87,
    discrepancies: 2,
  },
] as const

export const AUDIT_TYPE_OPTIONS = [
  { value: "full", label: "Full Audit" },
  { value: "partial", label: "Partial Audit" },
  { value: "spot", label: "Spot Check" },
] as const

export const AUDIT_STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const
