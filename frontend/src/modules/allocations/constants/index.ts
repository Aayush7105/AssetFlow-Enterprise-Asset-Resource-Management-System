export const MOCK_ALLOCATIONS = [
  {
    id: "1",
    assetName: "MacBook Pro 16\"",
    assetCode: "AST-001",
    assignedToName: "John Doe",
    departmentName: "Engineering",
    allocatedByName: "Admin",
    allocatedDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    assetName: "Ergonomic Chair",
    assetCode: "AST-010",
    assignedToName: "Jane Smith",
    departmentName: "HR",
    allocatedByName: "Admin",
    allocatedDate: "2024-02-01",
    returnDate: "2024-03-15",
    status: "returned",
  },
  {
    id: "3",
    assetName: "Projector EPSON X500",
    assetCode: "AST-015",
    assignedToName: "Mike Johnson",
    departmentName: "Marketing",
    allocatedByName: "Admin",
    allocatedDate: "2024-01-10",
    status: "overdue",
  },
] as const

export const ALLOCATION_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "returned", label: "Returned" },
  { value: "overdue", label: "Overdue" },
] as const