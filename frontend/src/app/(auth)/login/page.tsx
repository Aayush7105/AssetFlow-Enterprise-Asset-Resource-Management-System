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
import { Loader2, Eye, EyeOff, Shield } from "lucide-react"

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
    <div className="space-y-8 max-w-[440px] w-full p-6 sm:p-8 bg-[#09090B] border border-[#27272A] rounded-2xl shadow-xl">
      {/* HEADER WITH LOGO */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#FAFAFA] text-[#09090B]">
            <Shield className="size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white font-mono">AssetFlow</span>
        </div>

        <div className="space-y-1 pt-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h2>
          <p className="text-[13px] text-neutral-400">Sign in to continue to AssetFlow.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-medium text-neutral-300">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="h-10 bg-[#18181B] border-[#27272A] text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-ring text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-rose-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-medium text-neutral-300">Password</FormLabel>
                  <a
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
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
                      className="h-10 pr-10 bg-[#18181B] border-[#27272A] text-white placeholder:text-neutral-500 focus:ring-1 focus:ring-ring text-sm"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors duration-200"
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
                <FormMessage className="text-rose-400 text-xs" />
              </FormItem>
            )}
          />

          {/* High spacing between Password and Sign In */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-sm font-medium bg-[#FAFAFA] hover:bg-neutral-200 text-[#09090B] rounded-lg shadow-md hover:scale-[1.005] active:scale-[0.995] transition-all duration-150"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* QUICK DEMO ACCOUNTS */}
      <div className="space-y-2.5 pt-4 border-t border-[#27272A]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
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
              className="flex flex-col text-left p-2.5 rounded-lg border border-[#27272A] bg-[#18181B]/50 hover:bg-[#202024] hover:border-neutral-500 cursor-pointer transition-all duration-200"
            >
              <span className="text-[11px] font-semibold text-white truncate">{user.name}</span>
              <span className="text-[9px] text-neutral-400 uppercase font-medium mt-0.5 tracking-wider">{user.role.replace("_", " ")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-2 text-center">
        <p className="text-xs text-neutral-400 leading-normal">
          Already invited?{" "}
          <span className="text-neutral-500">
            Contact your administrator.
          </span>
        </p>
      </div>
    </div>
  )
}
