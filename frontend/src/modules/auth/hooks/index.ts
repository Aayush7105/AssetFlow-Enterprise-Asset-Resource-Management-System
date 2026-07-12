"use client"

import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/modules/auth/services"
import { toast } from "sonner"

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.logout)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const user = await authService.login(credentials)
      setUser(user)
      toast.success(`Welcome back, ${user.name}! Logged in as ${user.role}.`)
      return user
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid email or password.")
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    clearUser()
    toast.success("Successfully logged out.")
  }

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email)
    toast.success(`Password reset link sent to ${email}`)
  }

  const registerOrganization = async (data: {
    organizationName: string
    industry: string
    companyEmail: string
    phone?: string
    country: string
    timezone: string
    fullName: string
    workEmail: string
    password: string
  }) => {
    const result = await authService.registerOrganization(data)
    if (result.user) {
      setUser(result.user)
    }
    toast.success(result.message)
    return result
  }

  const verifyEmail = async (token: string, email: string) => {
    await authService.verifyEmail(token, email)
    toast.success("Email verified successfully!")
  }

  return {
    login,
    logout,
    forgotPassword,
    registerOrganization,
    verifyEmail,
  }
}

