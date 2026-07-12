import { apiRequest } from "@/lib/api"

type Query = Record<string, string | number | boolean | null | undefined>

export const assetService = {
  getAssets: async (filter?: Query) => {
    return apiRequest<unknown[]>("/assets", { query: filter })
  },
  getAsset: async (id: string) => {
    return apiRequest<unknown>(`/assets/${id}`)
  },
  createAsset: async (data: Record<string, unknown>) => {
    return apiRequest<unknown>("/assets", { method: "POST", body: data })
  },
  updateAsset: async (id: string, data: Record<string, unknown>) => {
    return apiRequest<unknown>(`/assets/${id}`, { method: "PUT", body: data })
  },
  deleteAsset: async (id: string) => {
    return apiRequest<unknown>(`/assets/${id}`, { method: "DELETE" })
  },
}
