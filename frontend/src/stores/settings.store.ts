import { create } from "zustand"

interface SettingsState {
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  setEmailNotifications: (val: boolean) => void
  setPushNotifications: (val: boolean) => void
  setInAppNotifications: (val: boolean) => void
  loadSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  setEmailNotifications: (val) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("email_notifications", String(val))
    }
    set({ emailNotifications: val })
  },
  setPushNotifications: (val) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("push_notifications", String(val))
    }
    set({ pushNotifications: val })
  },
  setInAppNotifications: (val) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("in_app_notifications", String(val))
    }
    set({ inAppNotifications: val })
  },
  loadSettings: () => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("email_notifications")
      const push = localStorage.getItem("push_notifications")
      const inApp = localStorage.getItem("in_app_notifications")

      set({
        emailNotifications: email === null ? true : email === "true",
        pushNotifications: push === null ? true : push === "true",
        inAppNotifications: inApp === null ? true : inApp === "true",
      })
    }
  },
}))
