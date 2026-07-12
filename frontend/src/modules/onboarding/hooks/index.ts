"use client"

export function useOnboarding() {
  return {
    submitCompany: async (_data: Record<string, unknown>) => {
      console.log("Submit company placeholder")
    },
    submitCategories: async (_categories: unknown[]) => {
      console.log("Submit categories placeholder")
    },
    submitDepartments: async (_departments: unknown[]) => {
      console.log("Submit departments placeholder")
    },
    submitEmployees: async (_employees: unknown[]) => {
      console.log("Submit employees placeholder")
    },
    completeOnboarding: async () => {
      console.log("Complete onboarding placeholder")
    },
  }
}
