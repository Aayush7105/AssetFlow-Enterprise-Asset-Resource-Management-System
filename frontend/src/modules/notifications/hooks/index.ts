"use client"

export function useNotifications() {
  return {
    getNotifications: async () => {
      console.log("Get notifications placeholder")
      return []
    },
    markAsRead: async (_id: string) => {
      console.log("Mark as read placeholder")
    },
    markAllAsRead: async () => {
      console.log("Mark all as read placeholder")
    },
    deleteNotification: async (_id: string) => {
      console.log("Delete notification placeholder")
    },
  }
}
