export interface AppNotification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  createdAt: string
  link?: string
  actionLabel?: string
}