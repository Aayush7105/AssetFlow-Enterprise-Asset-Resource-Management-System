export const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Asset Return Overdue",
    message: "Projector EPSON X500 allocated to Mike Johnson is overdue by 5 days.",
    type: "warning",
    read: false,
    createdAt: "2024-03-20T10:30:00Z",
    link: "/allocations",
    actionLabel: "View Allocation",
  },
  {
    id: "2",
    title: "Maintenance Completed",
    message: "Printer Canon iR-ADV has been repaired and is now available.",
    type: "success",
    read: false,
    createdAt: "2024-03-20T08:15:00Z",
    link: "/maintenance",
    actionLabel: "View Details",
  },
  {
    id: "3",
    title: "New Booking Request",
    message: "Alice Chen has requested the Conference Room Camera for March 20.",
    type: "info",
    read: true,
    createdAt: "2024-03-19T14:00:00Z",
    link: "/bookings",
    actionLabel: "Review Request",
  },
] as const

export const NOTIFICATION_TYPE_ICONS = {
  info: "Info",
  warning: "AlertTriangle",
  success: "CheckCircle",
  error: "XCircle",
} as const