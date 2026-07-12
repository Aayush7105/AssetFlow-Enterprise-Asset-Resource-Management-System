"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants"
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSubmitted(true)
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

        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          {submitted
            ? "Check your email for reset instructions"
            : "Enter your email and we'll send you a reset link"}
        </p>
      </div>

      {submitted ? (
        <div className="space-y-5">
          <div className="rounded-xl border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 shrink-0 mt-0.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Reset link sent successfully
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground/80">{email}</span>.
                  Please check your inbox and follow the instructions.
                </p>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full h-11 text-sm" asChild>
            <a href={ROUTES.LOGIN}>
              <ArrowLeft className="size-4" />
              Back to sign in
            </a>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                required
                disabled={isLoading}
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}

      {!submitted && (
        <a
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="size-3" />
          Back to sign in
        </a>
      )}
    </div>
  )
}
