import { apiRawRequest, apiRequest, type ApiResponse } from "@/lib/api"
import type { AppNotification, NotificationListResponse } from "@/modules/notifications/types"

type BackendNotificationList = ApiResponse<AppNotification[]> & {
  unread?: number
  count?: number
}

export const notificationService = {
  getNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiRawRequest<AppNotification[]>("/notifications") as BackendNotificationList

    return {
      unread: Number(response.unread ?? 0),
      count: Number(response.count ?? response.data?.length ?? 0),
      data: response.data ?? [],
    }
  },
  markAsRead: async (id: string) => {
    return apiRequest<AppNotification>(`/notifications/${id}/read`, { method: "PUT" })
  },
  markAllAsRead: async () => {
    return apiRequest<unknown>("/notifications/read-all", { method: "PUT" })
  },
  deleteNotification: async (id: string) => {
    return apiRequest<unknown>(`/notifications/${id}`, { method: "DELETE" })
  },
}
