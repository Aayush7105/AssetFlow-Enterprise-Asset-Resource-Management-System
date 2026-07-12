import { apiRequest } from "@/lib/api"

type Query = Record<string, string | number | boolean | null | undefined>

export const bookingService = {
  getBookings: async (filter?: Query) => {
    return apiRequest<unknown[]>("/resource-bookings", { query: filter })
  },
  createBooking: async (data: Record<string, unknown>) => {
    return apiRequest<unknown>("/resource-bookings", { method: "POST", body: data })
  },
  approveBooking: async (id: string) => {
    return apiRequest<unknown>(`/resource-bookings/${id}`, {
      method: "PUT",
      body: { status: "APPROVED" },
    })
  },
  rejectBooking: async (id: string, reason?: string) => {
    return apiRequest<unknown>(`/resource-bookings/${id}`, {
      method: "PUT",
      body: { status: "REJECTED", rejection_reason: reason },
    })
  },
  cancelBooking: async (id: string) => {
    return apiRequest<unknown>(`/resource-bookings/${id}/cancel`, { method: "PUT" })
  },
}
