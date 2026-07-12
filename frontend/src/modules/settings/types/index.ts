export interface OrganizationSettings {
  name: string
  logo?: string
  industry: string
  size: string
  website?: string
  email?: string
  phone?: string
  address?: string
}

export interface UserSettings {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
}
