import { z } from "zod";
import { ROLES } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const registerOrganizationSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters").max(100, "Organization name must be under 100 characters"),
  industry: z.string().min(1, "Select an industry"),
  companyEmail: z.string().min(1, "Company email is required").email("Enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(1, "Select a country"),
  timezone: z.string().min(1, "Select a timezone"),
});

export type RegisterOrganizationFormData = z.infer<typeof registerOrganizationSchema>;

export const registerAdminSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be under 100 characters"),
  workEmail: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterAdminFormData = z.infer<typeof registerAdminSchema>;

export const registrationSchema = registerOrganizationSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be under 100 characters"),
  workEmail: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const companySchema = z.object({
  name: z.string().min(2).max(100),
  industry: z.string().optional(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  website: z.string().url().optional().or(z.literal("")),
});

export const assetCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  code: z.string().min(2).max(20),
});

export const departmentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  headId: z.string().optional(),
});

export const employeeSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(ROLES),
  departmentId: z.string().optional(),
  employeeId: z.string().min(2),
});
