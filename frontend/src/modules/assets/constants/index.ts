export const EMPTY_ASSETS = [] as const

export const ASSET_STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "allocated", label: "Allocated" },
  { value: "in_maintenance", label: "In Maintenance" },
  { value: "disposed", label: "Disposed" },
] as const
