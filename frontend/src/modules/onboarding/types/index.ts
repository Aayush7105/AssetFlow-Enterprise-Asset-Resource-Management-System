export interface CompanyData {
  name: string
  industry: string
  size: string
  website?: string
  logo?: string
}

export interface AssetCategory {
  id?: string
  name: string
  code: string
  description?: string
}

export interface Department {
  id?: string
  name: string
  description?: string
  headId?: string
  headName?: string
}

export interface Employee {
  id?: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "asset_manager" | "department_head" | "employee"
  departmentId?: string
  departmentName?: string
  employeeId: string
}

export interface OnboardingReview {
  company: CompanyData
  categories: AssetCategory[]
  departments: Department[]
  employees: Employee[]
}