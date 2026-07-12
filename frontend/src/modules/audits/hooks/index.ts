"use client"

import { auditService } from "@/modules/audits/services"

export function useAudits() {
  return auditService
}
