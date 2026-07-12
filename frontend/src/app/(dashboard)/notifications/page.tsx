"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotificationStore } from "@/stores/notification.store"
import { useToast } from "@/hooks/use-toast"
import { notificationService } from "@/modules/notifications/services"
import type { AppNotification } from "@/modules/notifications/types"
import { Bell, CheckCheck, Trash2, Circle, X } from "lucide-react"

function formatNotificationTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Just now"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function isAlertNotification(item: AppNotification) {
  return ["REJECTED", "DISCREPANCY", "OVERDUE"].some((token) => item.type.includes(token))
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "alert">("all")

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationService.getNotifications()
      setNotifications(response.data)
      setUnreadCount(response.unread)
    } catch (error) {
      toast({
        title: "Could not load notifications",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  )

  useEffect(() => {
    setUnreadCount(unreadCount)
  }, [setUnreadCount, unreadCount])

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead()
    setNotifications((items) => items.map((item) => ({ ...item, is_read: true })))
    setUnreadCount(0)
    toast({ title: "Notifications read", description: "Marked all notifications as read." })
  }

  const handleClearAll = async () => {
    await Promise.all(notifications.map((item) => notificationService.deleteNotification(item.id)))
    setNotifications([])
    setUnreadCount(0)
    toast({ title: "Notifications cleared", description: "Deleted all notification entries." })
  }

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id)
    setNotifications((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item))
  }

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id)
    setNotifications((items) => items.filter((item) => item.id !== id))
    toast({ title: "Notification removed", description: "Deleted notification entry." })
  }

  const filtered = notifications.filter((item) => {
    if (filter === "unread") return !item.is_read
    if (filter === "alert") return isAlertNotification(item)
    return true
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="Stay updated with the latest activity"
        actions={
          notifications.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="h-8 text-xs">
                <CheckCheck className="size-3.5 mr-1" />
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="h-8 text-xs text-destructive hover:bg-destructive/5">
                <Trash2 className="size-3.5 mr-1" />
                Clear all
              </Button>
            </div>
          ) : null
        }
      />

      <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            filter === "all" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
            filter === "unread" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-4 px-1 rounded-sm text-[9px] shrink-0">
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setFilter("alert")}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
            filter === "alert" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Alerts
        </button>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="rounded-md border border-border/60 bg-card p-4 text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : filtered.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 rounded-md border border-border/60 bg-card transition-all ${
              !item.is_read ? "border-l-2 border-l-foreground bg-accent/5" : ""
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {!item.is_read ? (
                  <Circle className="size-2 fill-foreground text-foreground animate-pulse" />
                ) : (
                  <Circle className="size-2 text-muted-foreground/30" />
                )}
              </div>
              <div className="text-[13px]">
                <p className={`font-medium ${!item.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.title}
                </p>
                <p className="text-muted-foreground/80 mt-0.5 leading-snug">{item.message}</p>
                <span className="text-[11px] text-muted-foreground/50 block mt-1.5">
                  {formatNotificationTime(item.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-4">
              {!item.is_read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 hover:bg-accent"
                  onClick={() => handleMarkRead(item.id)}
                  title="Mark as read"
                >
                  <CheckCheck className="size-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 hover:bg-accent text-destructive/80 hover:text-destructive"
                onClick={() => handleDelete(item.id)}
                title="Delete notification"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <EmptyState
            icon={Bell}
            title="All caught up"
            description="No notifications found in this category."
          />
        )}
      </div>
    </div>
  )
}
