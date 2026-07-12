import { apiRequest } from "@/lib/api"

export const notificationService = {
  getNotifications: async () => {
    return apiRequest<unknown[]>("/notifications")
  },
  markAsRead: async (id: string) => {
    return apiRequest<unknown>(`/notifications/${id}/read`, { method: "PUT" })
  },
  markAllAsRead: async () => {
    return apiRequest<unknown>("/notifications/read-all", { method: "PUT" })
  },
  deleteNotification: async (id: string) => {
    return apiRequest<unknown>(`/notifications/${id}`, { method: "DELETE" })
  },
}
