export const MOCK_REPORTS = [
  {
    id: "1",
    name: "Monthly Asset Summary - February 2024",
    type: "asset_summary",
    format: "pdf",
    generatedByName: "Admin",
    dateRange: { from: "2024-02-01", to: "2024-02-29" },
    createdAt: "2024-03-01",
  },
  {
    id: "2",
    name: "Q1 Allocation Report",
    type: "allocation_report",
    format: "excel",
    generatedByName: "Admin",
    dateRange: { from: "2024-01-01", to: "2024-03-31" },
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    name: "Maintenance Cost Analysis - 2024",
    type: "maintenance_report",
    format: "pdf",
    generatedByName: "Emily Clark",
    dateRange: { from: "2024-01-01", to: "2024-03-31" },
    createdAt: "2024-03-20",
  },
] as const

export const REPORT_TYPE_OPTIONS = [
  { value: "asset_summary", label: "Asset Summary" },
  { value: "allocation_report", label: "Allocation Report" },
  { value: "maintenance_report", label: "Maintenance Report" },
  { value: "audit_report", label: "Audit Report" },
  { value: "department_report", label: "Department Report" },
  { value: "custom", label: "Custom Report" },
] as const

export const REPORT_FORMAT_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "excel", label: "Excel" },
] as const