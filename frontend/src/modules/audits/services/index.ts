import { apiRequest } from "@/lib/api"

type Query = Record<string, string | number | boolean | null | undefined>

export const auditService = {
  getAudits: async (filter?: Query) => {
    return apiRequest<unknown[]>("/audits", { query: filter })
  },
  createAudit: async (data: Record<string, unknown>) => {
    return apiRequest<unknown>("/audits", { method: "POST", body: data })
  },
  updateAudit: async (id: string, data: Record<string, unknown>) => {
    const action = typeof data.action === "string" ? data.action : "assign"
    return apiRequest<unknown>(`/audits/${id}/${action}`, { method: "PUT", body: data })
  },
  deleteAudit: async (id: string) => {
    return apiRequest<unknown>(`/audits/${id}/close`, { method: "PUT" })
  },
}
