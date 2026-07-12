import { create } from "zustand"
import { type UserRole } from "@/lib/constants"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  organizationId: string
  organizationName: string
  isOnboarded: boolean
  industry?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  updateOrganization: (name: string, industry: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("assetflow_user", JSON.stringify(user))
      } else {
        localStorage.removeItem("assetflow_user")
      }
    }
    set({ user, isAuthenticated: !!user })
  },
  setLoading: (isLoading) => set({ isLoading }),
  updateOrganization: (name, industry) => {
    set((state) => {
      if (!state.user) return state
      const updatedUser = {
        ...state.user,
        organizationName: name,
        industry,
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("assetflow_user", JSON.stringify(updatedUser))
      }
      return { user: updatedUser }
    })
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("assetflow_user")
    }
    set({ user: null, isAuthenticated: false })
  },
}))

