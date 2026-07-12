"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ROUTES } from "@/lib/constants"
import {
  registerOrganizationSchema,
  registerAdminSchema,
  type RegisterOrganizationFormData,
  type RegisterAdminFormData,
} from "@/lib/validators"
import { useAuth } from "@/modules/auth/hooks"
import { COUNTRIES, TIMEZONES } from "@/modules/auth/constants"
import { INDUSTRY_OPTIONS } from "@/modules/onboarding/constants"
import { useRouter } from "next/navigation"
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Building2,
  UserPlus,
  Eye,
  EyeOff,
  Upload,
  CheckCircle2,
} from "lucide-react"

const STEP_META = [
  {
    id: 1,
    title: "Organization Details",
    description: "Tell us about your company",
    icon: Building2,
  },
  {
    id: 2,
    title: "Admin Account",
    description: "Create the primary administrator",
    icon: UserPlus,
  },
] as const

export default function RegisterCompanyPage() {
  const router = useRouter()
  const { registerOrganization } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const orgForm = useForm<RegisterOrganizationFormData>({
    resolver: zodResolver(registerOrganizationSchema),
    defaultValues: {
      organizationName: "",
      industry: "",
      companyEmail: "",
      phone: "",
      country: "",
      timezone: "",
    },
  })

  const adminForm = useForm<RegisterAdminFormData>({
    resolver: zodResolver(registerAdminSchema),
    defaultValues: {
      fullName: "",
      workEmail: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleStep1Validate = async () => {
    const valid = await orgForm.trigger()
    if (valid) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const onSubmit = async () => {
    const adminValid = await adminForm.trigger()
    if (!adminValid) return

    const orgValid = orgForm.formState.isValid
    if (!orgValid) {
      setCurrentStep(1)
      orgForm.trigger()
      return
    }

    setIsSubmitting(true)
    try {
      const orgData = orgForm.getValues()
      const adminData = adminForm.getValues()

      await registerOrganization({
        organizationName: orgData.organizationName,
        industry: orgData.industry,
        companyEmail: orgData.companyEmail,
        phone: orgData.phone || undefined,
        country: orgData.country,
        timezone: orgData.timezone,
        fullName: adminData.fullName,
        workEmail: adminData.workEmail,
        password: adminData.password,
      })

      router.push(ROUTES.VERIFY_EMAIL)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-0 shadow-none bg-transparent p-0 flex flex-col gap-0 w-full">
      <CardHeader className="text-left pb-6 p-0 flex flex-col gap-1">
        <CardTitle className="text-3xl font-bold tracking-tight">Create your organization</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Get started with AssetFlow in minutes
        </p>
      </CardHeader>

      <CardContent className="space-y-6 p-0">
        {}
        <div className="flex items-center justify-center gap-3">
          {STEP_META.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full border-2 transition-all ${
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted-foreground/25 bg-background text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <StepIcon className="size-4" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-medium leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < STEP_META.length - 1 && (
                  <div className={`w-12 sm:w-16 h-0.5 mx-2 mt-[-1.25rem] ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        {}
        {currentStep === 1 && (
          <Form {...orgForm}>
            <form className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Organization Details</h3>
              </div>

              <FormField
                control={orgForm.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" disabled={isSubmitting} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={orgForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDUSTRY_OPTIONS.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orgForm.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@company.com"
                          autoComplete="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={orgForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <span className="text-muted-foreground font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={orgForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orgForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {}
              <div>
                <Label className="text-sm">
                  Organization Logo <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 hover:border-primary/40 transition-colors cursor-pointer mt-2">
                  <div className="text-center">
                    <Upload className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      SVG, PNG, or JPG (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  onClick={handleStep1Validate}
                  disabled={isSubmitting}
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {}
        {currentStep === 2 && (
          <Form {...adminForm}>
            <form className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="size-4 text-primary" />
                <h3 className="text-sm font-semibold">Admin Account</h3>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">
                  The first user is automatically assigned the <span className="font-semibold text-foreground">Admin</span> role.
                  Employees will be added later during workspace setup.
                </p>
              </div>

              <FormField
                control={adminForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        autoComplete="name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={adminForm.control}
                name="workEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={adminForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters with uppercase, lowercase, and a number
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={adminForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating organization...
                    </>
                  ) : (
                    <>
                      Create Organization
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        <Separator />

        <p className="text-xs text-center text-muted-foreground">
          Already have an account?{" "}
          <a href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
            Sign in
          </a>
        </p>
      </CardContent>
    </Card>
  )
}

function Label({ className, children, ...props }: React.ComponentProps<"label">) {
  return <label className={className} {...props}>{children}</label>
}