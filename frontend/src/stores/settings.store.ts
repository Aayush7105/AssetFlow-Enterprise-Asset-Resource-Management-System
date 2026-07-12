"use client"

import { create } from "zustand"

interface SettingsState {
  industry: string
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  setIndustry: (industry: string) => void
  setEmailNotifications: (enabled: boolean) => void
  setPushNotifications: (enabled: boolean) => void
  setInAppNotifications: (enabled: boolean) => void
  loadSettings: () => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  industry: "Technology",
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  setIndustry: (industry) => {
    localStorage.setItem("settings_industry", industry)
    set({ industry })
  },
  setEmailNotifications: (enabled) => {
    localStorage.setItem("settings_emailNotifications", JSON.stringify(enabled))
    set({ emailNotifications: enabled })
  },
  setPushNotifications: (enabled) => {
    localStorage.setItem("settings_pushNotifications", JSON.stringify(enabled))
    set({ pushNotifications: enabled })
  },
  setInAppNotifications: (enabled) => {
    localStorage.setItem("settings_inAppNotifications", JSON.stringify(enabled))
    set({ inAppNotifications: enabled })
  },
  loadSettings: () => {
    if (typeof window !== "undefined") {
      const ind = localStorage.getItem("settings_industry") || "Technology"
      const email = localStorage.getItem("settings_emailNotifications")
      const push = localStorage.getItem("settings_pushNotifications")
      const inApp = localStorage.getItem("settings_inAppNotifications")
      
      set({
        industry: ind,
        emailNotifications: email !== null ? JSON.parse(email) : true,
        pushNotifications: push !== null ? JSON.parse(push) : true,
        inAppNotifications: inApp !== null ? JSON.parse(inApp) : true,
      })
    }
  },
}))
