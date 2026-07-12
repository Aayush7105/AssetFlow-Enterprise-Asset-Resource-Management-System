export const ONBOARDING_STEPS = [
  { id: 1, title: "Company", description: "Your organization details", route: "/company" },
  { id: 2, title: "Categories", description: "Set up asset categories", route: "/asset-categories" },
  { id: 3, title: "Departments", description: "Create departments", route: "/departments" },
  { id: 4, title: "Employees", description: "Add team members", route: "/employees" },
  { id: 5, title: "Review", description: "Review and confirm", route: "/review" },
] as const

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Education",
  "Retail",
  "Real Estate",
  "Government",
  "Other",
] as const

export const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
] as const