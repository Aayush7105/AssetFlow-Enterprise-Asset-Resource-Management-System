"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useERPStore } from "@/stores/erp.store"
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Package,
  Wrench,
  AlertTriangle,
} from "lucide-react"

export default function ReportsPage() {
  const { toast } = useToast()
  const { assets, maintenance, allocations } = useERPStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCSV = (reportType: string) => {
    setIsGenerating(true)
    setTimeout(() => {
      let csvContent = ""
      let filename = ""

      if (reportType === "assets") {
        csvContent = "Asset Tag,Asset Name,Category,Serial Number,Assignee,Department,Location,Status,Condition\n"
        assets.forEach((a) => {
          csvContent += `"${a.assetTag}","${a.name}","${a.category}","${a.serialNumber || ""}","${a.assignedEmployee || ""}","${a.department || ""}","${a.location || ""}","${a.status}","${a.condition}"\n`
        })
        filename = "Asset_Inventory_Report.csv"
      } else if (reportType === "maintenance") {
        csvContent = "ID,Asset Name,Description,Priority,Status,Technician,Date\n"
        maintenance.forEach((m) => {
          csvContent += `"${m.id}","${m.assetName}","${m.description}","${m.priority}","${m.status}","${m.technician || ""}","${m.createdAt}"\n`
        })
        filename = "Maintenance_Log_Report.csv"
      } else {
        csvContent = "ID,Asset Name,Assignee,Department,Allocation Date,Expected Return,Status\n"
        allocations.forEach((al) => {
          csvContent += `"${al.id}","${al.assetName}","${al.employeeName}","${al.department}","${al.allocationDate}","${al.expectedReturnDate || ""}","${al.status}"\n`
        })
        filename = "Allocations_Report.csv"
      }

      downloadFile(csvContent, filename, "text/csv;charset=utf-8;")
      setIsGenerating(false)
      toast({
        title: "Report Exported",
        description: `Successfully exported ${filename} in CSV format.`,
      })
    }, 800)
  }

  const exportText = (reportType: string, format: "txt" | "pdf") => {
    setIsGenerating(true)
    setTimeout(() => {
      let content = `==================================================\n`
      content += `          ASSETFLOW ENTERPRISE REPORT             \n`
      content += `          Type: ${reportType.toUpperCase()} LOG  \n`
      content += `          Generated: ${new Date().toLocaleString()} \n`
      content += `==================================================\n\n`

      if (reportType === "assets") {
        assets.forEach((a) => {
          content += `[${a.assetTag}] ${a.name}\n`
          content += `  Category: ${a.category} | S/N: ${a.serialNumber || "N/A"}\n`
          content += `  Status: ${a.status} | Condition: ${a.condition}\n`
          content += `  Location: ${a.location || "N/A"} | Assignee: ${a.assignedEmployee || "Unassigned"}\n`
          content += `--------------------------------------------------\n`
        })
      } else if (reportType === "maintenance") {
        maintenance.forEach((m) => {
          content += `Ticket #${m.id} - ${m.assetName}\n`
          content += `  Priority: ${m.priority} | Status: ${m.status}\n`
          content += `  Tech: ${m.technician || "Unassigned"} | Created: ${m.createdAt}\n`
          content += `  Problem: ${m.description}\n`
          content += `--------------------------------------------------\n`
        })
      } else {
        allocations.forEach((al) => {
          content += `Allocation #${al.id} - ${al.assetName}\n`
          content += `  Assignee: ${al.employeeName} (${al.department})\n`
          content += `  Allocated: ${al.allocationDate} | Expected Return: ${al.expectedReturnDate || "Permanent"}\n`
          content += `  Status: ${al.status}\n`
          content += `--------------------------------------------------\n`
        })
      }

      const ext = format === "pdf" ? "pdf.txt" : "txt"
      downloadFile(content, `${reportType}_report.${ext}`, "text/plain;charset=utf-8;")
      setIsGenerating(false)
      toast({
        title: "Report Exported",
        description: `Successfully exported ${reportType} report in ${format.toUpperCase()} format.`,
      })
    }, 800)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytical Reports"
        description="Generate, export and download enterprise inventory and maintenance reports"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Assets Inventory Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-none card-hover flex flex-col justify-between">
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 mb-4">
              <Package className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">Asset Inventory</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-6">
              Complete list of enterprise hardware, categories, values, conditions, and assignment statuses.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportCSV("assets")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileSpreadsheet className="size-3.5 mr-2 text-emerald-600" />
              Export CSV Spreadsheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportText("assets", "pdf")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileText className="size-3.5 mr-2 text-red-500" />
              Export PDF Document
            </Button>
          </div>
        </div>

        {/* Maintenance Log Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-none card-hover flex flex-col justify-between">
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 mb-4">
              <Wrench className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">Maintenance History</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-6">
              Track log requests, technicians, status changes, repair metrics, and device failure rates.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportCSV("maintenance")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileSpreadsheet className="size-3.5 mr-2 text-emerald-600" />
              Export CSV Spreadsheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportText("maintenance", "pdf")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileText className="size-3.5 mr-2 text-red-500" />
              Export PDF Document
            </Button>
          </div>
        </div>

        {/* Allocation Movement Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-none card-hover flex flex-col justify-between">
          <div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 mb-4">
              <TrendingUp className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">Allocation Ledger</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-6">
              Track active assignments, custody transfers, check-in history, and return compliance dates.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportCSV("allocations")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileSpreadsheet className="size-3.5 mr-2 text-emerald-600" />
              Export CSV Spreadsheet
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isGenerating}
              onClick={() => exportText("allocations", "pdf")}
              className="h-8.5 text-xs w-full justify-start"
            >
              <FileText className="size-3.5 mr-2 text-red-500" />
              Export PDF Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
