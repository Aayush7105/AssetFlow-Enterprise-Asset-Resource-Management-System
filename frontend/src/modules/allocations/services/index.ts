import { apiRequest } from "@/lib/api"

type Query = Record<string, string | number | boolean | null | undefined>

export const allocationService = {
  getAllocations: async (filter?: Query) => {
    return apiRequest<unknown[]>("/allocations", { query: filter })
  },
  createAllocation: async (data: Record<string, unknown>) => {
    return apiRequest<unknown>("/allocations", { method: "POST", body: data })
  },
  updateAllocation: async (id: string, data: Record<string, unknown>) => {
    return apiRequest<unknown>(`/allocations/${id}`, { method: "PUT", body: data })
  },
  returnAllocation: async (id: string) => {
    return apiRequest<unknown>(`/allocations/${id}/return`, { method: "PUT" })
  },
}
