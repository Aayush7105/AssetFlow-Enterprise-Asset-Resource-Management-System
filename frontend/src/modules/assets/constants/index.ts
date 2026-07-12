export const MOCK_ASSETS = [
  {
    id: "1",
    name: "MacBook Pro 16\"",
    code: "AST-001",
    categoryName: "Laptops",
    departmentName: "Engineering",
    status: "allocated",
    purchaseCost: 2499,
    currentValue: 1800,
    assignedToName: "John Doe",
  },
  {
    id: "2",
    name: "Dell UltraSharp 27\"",
    code: "AST-002",
    categoryName: "Monitors",
    departmentName: "Design",
    status: "available",
    purchaseCost: 619,
    currentValue: 450,
  },
  {
    id: "3",
    name: "Cisco Router X2000",
    code: "AST-003",
    categoryName: "Networking",
    departmentName: "IT Infrastructure",
    status: "in_maintenance",
    purchaseCost: 1200,
    currentValue: 800,
  },
] as const

export const ASSET_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "allocated", label: "Allocated" },
  { value: "in_maintenance", label: "In Maintenance" },
  { value: "disposed", label: "Disposed" },
] as const