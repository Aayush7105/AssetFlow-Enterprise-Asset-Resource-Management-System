import { apiRawRequest, clearAuthSession, saveAuthSession } from "@/lib/api"
import { type UserRole } from "@/lib/constants"
import { type User } from "@/stores/auth.store"

type BackendUser = {
  id: string
  name: string
  email: string
  phone?: string
  department_id?: string
  status?: string
  is_first_login?: boolean
  role?: string | null
}

function toAppRole(role?: string | null): UserRole {
  switch (role) {
    case "ADMIN":
      return "admin"
    case "ASSET_MANAGER":
      return "asset_manager"
    case "DEPARTMENT_HEAD":
      return "department_head"
    case "AUDITOR":
      return "auditor"
    default:
      return "employee"
  }
}

function toAppUser(user: BackendUser): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: toAppRole(user.role),
    organizationId: "default",
    organizationName: "AssetFlow",
    isOnboarded: !user.is_first_login,
  }
}

function requireUser(user: BackendUser | undefined): BackendUser {
  if (!user) {
    throw new Error("Backend did not return user data.")
  }

  return user
}

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRawRequest<BackendUser>("/auth/login", {
      method: "POST",
      body: credentials,
    })

    if (response.token) {
      saveAuthSession(response.token)
    }

    return toAppUser(requireUser(response.data))
  },

  logout: async () => {
    clearAuthSession()
  },

  forgotPassword: async (_email: string) => {
    throw new Error("Password reset is not available in the backend yet.")
  },

  resetPassword: async (_data: { token: string; password: string }) => {
    throw new Error("Password reset is not available in the backend yet.")
  },

  registerOrganization: async (data: {
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
    const response = await apiRawRequest<BackendUser>("/auth/register", {
      method: "POST",
      body: {
        name: data.fullName,
        email: data.workEmail,
        password: data.password,
        phone: data.phone,
      },
    })

    if (response.token) {
      saveAuthSession(response.token)
    }

    return {
      organizationId: "default",
      userId: requireUser(response.data).id,
      requiresEmailVerification: false,
      message: response.message ?? "Organization registered successfully",
      user: toAppUser(requireUser(response.data)),
    }
  },

  verifyEmail: async (_token: string, _email: string) => {
    return { message: "Email verification is not required for this backend." }
  },

  resendVerificationEmail: async (_email: string) => {
    throw new Error("Email verification is not available in the backend yet.")
  },
}
