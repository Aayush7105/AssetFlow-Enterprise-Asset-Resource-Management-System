"use client"

import { useAuthStore } from "@/stores/auth.store"
import { authService } from "@/modules/auth/services"
import { toast } from "sonner"

export const DEMO_USERS = [
  {
    id: "demo-admin-id",
    email: "admin@assetflow.com",
    password: "admin123",
    name: "Alex Admin",
    role: "admin" as const,
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    isOnboarded: true,
  },
  {
    id: "demo-manager-id",
    email: "manager@assetflow.com",
    password: "ManagerPassword123",
    name: "Sarah Manager",
    role: "asset_manager" as const,
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    isOnboarded: true,
  },
  {
    id: "demo-head-id",
    email: "head@assetflow.com",
    password: "HeadPassword123",
    name: "David Head",
    role: "department_head" as const,
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    isOnboarded: true,
  },
  {
    id: "demo-employee-id",
    email: "employee@assetflow.com",
    password: "EmployeePassword123",
    name: "Emily Employee",
    role: "employee" as const,
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    isOnboarded: true,
  },
  {
    id: "demo-auditor-id",
    email: "auditor@assetflow.com",
    password: "AuditorPassword123",
    name: "Audrey Auditor",
    role: "auditor" as const,
    organizationId: "org-1",
    organizationName: "Acme Enterprise",
    isOnboarded: true,
  },
]

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
      toast.error("Unable to sign in. Please try again.")
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
