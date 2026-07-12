"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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

const stepEase = [0.25, 0.1, 0.25, 1]

function stepVariants(direction: number) {
  return {
    initial: {
      opacity: 0,
      x: direction * 40,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4, ease: stepEase as unknown as number[] },
    },
    exit: {
      opacity: 0,
      x: -direction * 40,
      filter: "blur(4px)",
      transition: { duration: 0.25, ease: stepEase as unknown as number[] },
    },
  }
}

export default function RegisterCompanyPage() {
  const router = useRouter()
  const { registerOrganization } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [stepDirection, setStepDirection] = useState(1)
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

  const goToStep = (step: number, direction: number) => {
    setStepDirection(direction)
    setCurrentStep(step)
  }

  const handleStep1Next = async () => {
    const valid = await orgForm.trigger()
    if (valid) goToStep(2, 1)
  }

  const handleBack = () => {
    goToStep(1, -1)
  }

  const onSubmit = async () => {
    const adminValid = await adminForm.trigger()
    if (!adminValid) return

    const orgValid = orgForm.formState.isValid
    if (!orgValid) {
      goToStep(1, -1)
      setTimeout(() => orgForm.trigger(), 100)
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

      router.push(ROUTES.ONBOARDING)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-2 mb-6">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <svg
              className="size-[18px]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">
            AssetFlow
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Create your organization
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with AssetFlow in minutes
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        {[
          { id: 1, label: "Organization", icon: Building2 },
          { id: 2, label: "Admin", icon: UserPlus },
        ].map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id
          const Icon = step.icon

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2.5 flex-1">
                <div
                  className={`flex size-7 items-center justify-center rounded-full border transition-all duration-300 ${
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted-foreground/20 text-muted-foreground/50"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Icon className="size-3.5" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < 1 && (
                <div
                  className={`w-8 h-px mx-3 transition-colors duration-300 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/15"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="relative overflow-hidden min-h-[420px]">
        <AnimatePresence mode="wait" custom={stepDirection}>
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={stepDirection}
              variants={stepVariants(stepDirection)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <Form {...orgForm}>
                <form className="space-y-4">
                  <FormField
                    control={orgForm.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Organization Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Acme Corporation"
                            disabled={isSubmitting}
                            className="h-11"
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
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRY_OPTIONS.map((industry) => (
                                <SelectItem
                                  key={industry}
                                  value={industry}
                                >
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
                          <FormLabel className="text-sm">
                            Company Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="admin@company.com"
                              autoComplete="email"
                              disabled={isSubmitting}
                              className="h-11"
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
                        <FormLabel className="text-sm">
                          Phone{" "}
                          <span className="text-muted-foreground/50 font-normal">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            disabled={isSubmitting}
                            className="h-11"
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
                          <FormLabel className="text-sm">Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem
                                  key={country.value}
                                  value={country.value}
                                >
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
                          <FormLabel className="text-sm">Timezone</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11">
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

                  <div>
                    <Label className="text-sm">
                      Organization Logo{" "}
                      <span className="text-muted-foreground/50 font-normal">
                        (optional)
                      </span>
                    </Label>
                    <div className="flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-5 hover:border-primary/30 transition-colors duration-200 cursor-pointer mt-2">
                      <div className="text-center">
                        <Upload className="size-6 mx-auto text-muted-foreground/40 mb-1.5" />
                        <p className="text-xs text-muted-foreground/60">
                          <span className="text-primary/80 font-medium">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                          SVG, PNG, or JPG (max. 2MB)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={handleStep1Next}
                      disabled={isSubmitting}
                      className="h-11 text-sm font-medium"
                    >
                      Continue
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={stepDirection}
              variants={stepVariants(stepDirection)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <Form {...adminForm}>
                <form className="space-y-4">
                  <div className="rounded-lg border border-primary/15 bg-primary/[0.03] p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      The first user is automatically assigned the{" "}
                      <span className="font-semibold text-foreground/80">
                        Admin
                      </span>{" "}
                      role. Employees will be added later during workspace
                      setup.
                    </p>
                  </div>

                  <FormField
                    control={adminForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            autoComplete="name"
                            disabled={isSubmitting}
                            className="h-11"
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
                        <FormLabel className="text-sm">Work Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@company.com"
                            autoComplete="email"
                            disabled={isSubmitting}
                            className="h-11"
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
                        <FormLabel className="text-sm">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              autoComplete="new-password"
                              disabled={isSubmitting}
                              className="h-11 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-[11px] text-muted-foreground/50 mt-1">
                          Min 8 characters with uppercase, lowercase, and a
                          number
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              autoComplete="new-password"
                              disabled={isSubmitting}
                              className="h-11 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
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
                      className="h-11 text-sm"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={onSubmit}
                      disabled={isSubmitting}
                      className="h-11 text-sm font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Creating...
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Already have an organization?{" "}
          <a
            href={ROUTES.LOGIN}
            className="text-muted-foreground/60 hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/20 hover:decoration-muted-foreground/50"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
