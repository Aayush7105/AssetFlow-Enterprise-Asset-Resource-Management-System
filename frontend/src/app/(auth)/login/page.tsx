"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ROUTES } from "@/lib/constants"
import { loginSchema, type LoginFormData } from "@/lib/validators"
import { useAuth } from "@/modules/auth/hooks"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

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
    <Card className="border-0 shadow-none bg-transparent p-0 flex flex-col gap-0 w-full">
      <CardHeader className="text-left pb-6 p-0 flex flex-col gap-1">
        <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 p-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@company.com"
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
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <a
                      href={ROUTES.FORGOT_PASSWORD}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium"
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
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-6 p-0">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <p className="text-sm font-medium">New to AssetFlow?</p>
              <a
                href={ROUTES.REGISTER_COMPANY}
                className="text-sm text-primary hover:underline font-medium"
              >
                Register your organization
              </a>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Already invited?{" "}
              <span className="font-medium text-foreground/70">Contact your administrator for access.</span>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}