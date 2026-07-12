"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ROUTES } from "@/lib/constants"
import { loginSchema, type LoginFormData } from "@/lib/validators"
import { useAuth, DEMO_USERS } from "@/modules/auth/hooks"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      await login(data)
      router.push(ROUTES.DASHBOARD)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
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
          <span className="text-lg font-semibold tracking-tight">AssetFlow</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@company.com"
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
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm">Password</FormLabel>
                  <a
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 text-sm font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="space-y-3 pt-4 border-t border-border/50">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Quick Demo Accounts (Click to log in)
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.role}
              type="button"
              onClick={() => {
                form.setValue("email", user.email)
                form.setValue("password", user.password)
                form.handleSubmit(onSubmit)()
              }}
              className="flex flex-col text-left p-3 rounded-lg border border-border/80 bg-muted/20 hover:bg-accent/50 hover:border-border/100 hover:scale-[1.02] cursor-pointer transition-all duration-200"
            >
              <span className="text-xs font-semibold text-foreground truncate">{user.name}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium mt-0.5">{user.role.replace("_", " ")}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <p className="text-xs text-center text-muted-foreground/70">
          Already invited?{" "}
          <span className="text-foreground/50">
            Contact your administrator for access.
          </span>
        </p>

        <div className="flex justify-end">
          <a
            href={ROUTES.REGISTER_COMPANY}
            className="group inline-flex items-center gap-1 text-xs text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
          >
            Register your Organization
            <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
