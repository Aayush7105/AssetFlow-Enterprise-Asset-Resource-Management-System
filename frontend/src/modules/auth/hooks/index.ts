"use client"

import { useAuthStore } from "@/stores/auth.store"
import { toast } from "sonner"

export const DEMO_USERS = [
  {
    id: "demo-admin-id",
    email: "admin@assetflow.com",
    password: "AdminPassword123",
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
    await new Promise((r) => setTimeout(r, 800))

    const user = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    )

    if (user) {
      setUser(user)
      toast.success(`Welcome back, ${user.name}! Logged in as ${user.role}.`)
      return user
    } else {
      toast.error("Invalid email or password. Please use one of the demo accounts.")
      throw new Error("Invalid credentials")
    }
  }

  const logout = async () => {
    clearUser()
    toast.success("Successfully logged out.")
  }

  const forgotPassword = async (email: string) => {
    await new Promise((r) => setTimeout(r, 500))
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
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Organization registered successfully!")
    return {
      organizationId: "org-placeholder",
      userId: "user-placeholder",
      requiresEmailVerification: true,
      message: "Organization registered successfully",
    }
  }

  const verifyEmail = async (token: string, email: string) => {
    await new Promise((r) => setTimeout(r, 1000))
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
