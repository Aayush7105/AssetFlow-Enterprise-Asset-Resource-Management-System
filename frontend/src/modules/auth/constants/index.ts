export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER_COMPANY: "/register-company",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_EMAIL: "/verify-email",
} as const

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_LOCKED: "Account is temporarily locked",
  SESSION_EXPIRED: "Session has expired. Please log in again",
  ORG_ALREADY_EXISTS: "An organization with this email already exists",
  EMAIL_ALREADY_REGISTERED: "This email is already registered",
  VERIFICATION_TOKEN_EXPIRED: "Verification link has expired. Please request a new one.",
  VERIFICATION_TOKEN_INVALID: "Invalid verification link.",
} as const

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IN", label: "India" },
  { value: "JP", label: "Japan" },
  { value: "BR", label: "Brazil" },
  { value: "SG", label: "Singapore" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "ZA", label: "South Africa" },
  { value: "NG", label: "Nigeria" },
  { value: "MX", label: "Mexico" },
  { value: "KR", label: "South Korea" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
] as const

export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "America/Sao_Paulo", label: "Brasilia Time" },
  { value: "Europe/London", label: "Greenwich Mean Time" },
  { value: "Europe/Paris", label: "Central European Time" },
  { value: "Europe/Berlin", label: "Central European Time" },
  { value: "Asia/Dubai", label: "Gulf Standard Time" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
  { value: "Asia/Singapore", label: "Singapore Time" },
  { value: "Asia/Tokyo", label: "Japan Standard Time" },
  { value: "Asia/Seoul", label: "Korea Standard Time" },
  { value: "Australia/Sydney", label: "Australian Eastern Time" },
  { value: "Africa/Lagos", label: "West Africa Time" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time" },
] as const
