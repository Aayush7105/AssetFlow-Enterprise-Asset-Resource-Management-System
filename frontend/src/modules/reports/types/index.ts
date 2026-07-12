export interface Report {
  id: string
  name: string
  type: "asset_summary" | "allocation_report" | "maintenance_report" | "audit_report" | "department_report" | "custom"
  format: "pdf" | "csv" | "excel"
  generatedById: string
  generatedByName: string
  dateRange: { from: string; to: string }
  createdAt: string
  downloadUrl?: string
}