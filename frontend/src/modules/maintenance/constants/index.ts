export const MOCK_MAINTENANCE = [
  {
    id: "1",
    assetName: "Cisco Router X2000",
    assetCode: "AST-003",
    requestedByName: "Tom Harris",
    type: "corrective",
    priority: "high",
    description: "Intermittent connectivity drops affecting network stability",
    status: "in_progress",
    scheduledDate: "2024-03-20",
  },
  {
    id: "2",
    assetName: "HVAC Unit - Floor 3",
    assetCode: "AST-025",
    requestedByName: "Sarah Lee",
    type: "preventive",
    priority: "medium",
    description: "Quarterly preventive maintenance and filter replacement",
    status: "pending",
    scheduledDate: "2024-03-25",
  },
  {
    id: "3",
    assetName: "Printer Canon iR-ADV",
    assetCode: "AST-030",
    requestedByName: "Admin",
    type: "emergency",
    priority: "critical",
    description: "Paper jam causing hardware fault, needs immediate repair",
    status: "completed",
    completedDate: "2024-03-10",
    cost: 150,
  },
] as const

export const MAINTENANCE_TYPE_OPTIONS = [
  { value: "preventive", label: "Preventive" },
  { value: "corrective", label: "Corrective" },
  { value: "emergency", label: "Emergency" },
] as const

export const MAINTENANCE_PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const
