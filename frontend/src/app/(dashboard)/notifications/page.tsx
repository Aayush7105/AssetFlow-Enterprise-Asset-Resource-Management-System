"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore } from "@/stores/erp.store"
import { useNotificationStore } from "@/stores/notification.store"
import { useToast } from "@/hooks/use-toast"
import { Bell, CheckCheck, Trash2, Eye, Circle, X } from "lucide-react"

export default function NotificationsPage() {
  const { toast } = useToast()
  const { notifications, markNotificationRead, deleteNotification, clearAllNotifications } = useERPStore()
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount)

  // Filter state
  const [filter, setFilter] = useState<"all" | "unread" | "alert">("all")

  // Sync unreadCount to notification store
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [notifications, setUnreadCount])

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id)
    })
    toast({ title: "Notifications Read", description: "Marked all notifications as read." })
  }

  const handleClearAll = () => {
    clearAllNotifications()
    toast({ title: "Notifications Cleared", description: "Deleted all notifications." })
  }

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "alert") return n.category === "alert"
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
          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
            filter === "all" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
            filter === "unread" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {notifications.filter((n) => !n.read).length > 0 && (
            <Badge variant="secondary" className="h-4 px-1 rounded-sm text-[9px] shrink-0">
              {notifications.filter((n) => !n.read).length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setFilter("alert")}
          className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
            filter === "alert" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Alerts
        </button>
      </div>

      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 rounded-2xl border border-border/60 bg-card transition-all ${
              !item.read ? "border-l-2 border-l-foreground bg-accent/5" : ""
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0">
                {!item.read ? (
                  <Circle className="size-2 fill-foreground text-foreground animate-pulse" />
                ) : (
                  <Circle className="size-2 text-muted-foreground/30" />
                )}
              </div>
              <div className="text-[13px]">
                <p className={`font-medium ${!item.read ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.title}
                </p>
                <p className="text-muted-foreground/80 mt-0.5 leading-snug">{item.description}</p>
                <span className="text-[11px] text-muted-foreground/50 block mt-1.5">{item.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-4">
              {!item.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 hover:bg-accent"
                  onClick={() => markNotificationRead(item.id)}
                  title="Mark as read"
                >
                  <CheckCheck className="size-3.5 text-muted-foreground hover:text-foreground" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 hover:bg-accent text-destructive/80 hover:text-destructive"
                onClick={() => {
                  deleteNotification(item.id)
                  toast({ title: "Notification Removed", description: "Deleted notification entry." })
                }}
                title="Delete notification"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
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
