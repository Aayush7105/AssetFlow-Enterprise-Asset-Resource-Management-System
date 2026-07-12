import { apiRequest } from "@/lib/api"

export const onboardingService = {
  submitCompany: async (_data: Record<string, unknown>) => {
    return undefined
  },
  submitCategories: async (categories: unknown[]) => {
    return Promise.all(
      categories.map((category) =>
        apiRequest<unknown>("/asset-categories", {
          method: "POST",
          body: category,
        })
      )
    )
  },
  submitDepartments: async (departments: unknown[]) => {
    return Promise.all(
      departments.map((department) =>
        apiRequest<unknown>("/departments", {
          method: "POST",
          body: department,
        })
      )
    )
  },
  submitEmployees: async (employees: unknown[]) => {
    return Promise.all(
      employees.map((employee) =>
        apiRequest<unknown>("/users", {
          method: "POST",
          body: employee,
        })
      )
    )
  },
  completeOnboarding: async () => {
    return undefined
  },
}
