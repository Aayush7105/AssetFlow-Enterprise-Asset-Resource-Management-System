export const MOCK_BOOKINGS = [
  {
    id: "1",
    assetName: "Conference Room Camera",
    bookedByName: "Alice Chen",
    departmentName: "Marketing",
    startDate: "2024-03-20",
    endDate: "2024-03-20",
    purpose: "Client presentation recording",
    status: "pending",
  },
  {
    id: "2",
    assetName: "Portable Projector",
    bookedByName: "Bob Wilson",
    departmentName: "Sales",
    startDate: "2024-03-18",
    endDate: "2024-03-19",
    purpose: "On-site demo for prospective client",
    status: "approved",
    approvedByName: "Admin",
  },
  {
    id: "3",
    assetName: "iPad Pro 12.9\"",
    bookedByName: "Carol Davis",
    departmentName: "Design",
    startDate: "2024-03-15",
    endDate: "2024-03-17",
    purpose: "Design workshop demo",
    status: "completed",
  },
] as const

export const BOOKING_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const
