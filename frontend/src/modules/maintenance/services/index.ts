import { apiRequest } from "@/lib/api"

type Query = Record<string, string | number | boolean | null | undefined>

export const maintenanceService = {
  getRequests: async (filter?: Query) => {
    return apiRequest<unknown[]>("/maintenance", { query: filter })
  },
  createRequest: async (data: Record<string, unknown>) => {
    return apiRequest<unknown>("/maintenance", { method: "POST", body: data })
  },
  updateRequest: async (id: string, data: Record<string, unknown>) => {
    const action = typeof data.action === "string" ? data.action : "approve"
    return apiRequest<unknown>(`/maintenance/${id}/${action}`, {
      method: "PUT",
      body: data,
    })
  },
  deleteRequest: async (id: string) => {
    return apiRequest<unknown>(`/maintenance/${id}/reject`, { method: "PUT" })
  },
}
