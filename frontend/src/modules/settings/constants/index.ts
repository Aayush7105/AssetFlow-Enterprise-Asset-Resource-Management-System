export const MOCK_ORG_SETTINGS = {
  name: "Acme Corporation",
  industry: "Technology",
  size: "201-500",
  website: "https://acme.com",
  email: "admin@acme.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, San Francisco, CA 94105",
} as const

export const NOTIFICATION_PREFERENCES = [
  { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
  { key: "push", label: "Push Notifications", description: "Receive push notifications in browser" },
  { key: "inApp", label: "In-App Notifications", description: "Show notifications within the app" },
] as const
