export interface LoginCredentials {
  email: string
  password: string
}

export interface ForgotPasswordData {
  email: string
}

export interface RegisterOrganizationData {
  organizationName: string
  industry: string
  companyEmail: string
  phone?: string
  country: string
  timezone: string
}

export interface RegisterAdminData {
  fullName: string
  workEmail: string
  password: string
  confirmPassword: string
}

export interface RegistrationData extends RegisterOrganizationData {
  fullName: string
  workEmail: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string
    role: "admin" | "asset_manager" | "department_head" | "employee"
    avatar?: string
    organizationId: string
    organizationName: string
    isOnboarded: boolean
  }
  token: string
}

export interface RegistrationResponse {
  organizationId: string
  userId: string
  requiresEmailVerification: boolean
  message: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface EmailVerificationData {
  token: string
  email: string
}