export interface AppNotification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  reference_type: string | null
  reference_id: string | null
  created_at: string
  updated_at?: string | null
}

export interface NotificationListResponse {
  unread: number
  count: number
  data: AppNotification[]
}
