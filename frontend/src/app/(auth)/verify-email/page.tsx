"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { useAuth } from "@/modules/auth/hooks"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mail,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { verifyEmail } = useAuth()
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const hasToken = !!searchParams.get("token")

  const doVerify = useCallback(
    async (token: string) => {
      setIsVerifying(true)
      try {
        await verifyEmail(token, email)
        setIsVerified(true)
      } finally {
        setIsVerifying(false)
      }
    },
    [verifyEmail, email],
  )

  useEffect(() => {
    const token = searchParams.get("token")
    if (hasToken && email && token) {
      doVerify(token)
    }
  }, [hasToken, email, searchParams, doVerify])

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setResendSuccess(true)
    } finally {
      setIsResending(false)
    }
  }

  const handleContinue = () => {
    router.push(ROUTES.COMPANY)
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

        <h1 className="text-2xl font-bold tracking-tight">
          {isVerified ? "Email verified" : "Check your email"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isVerified
            ? "Your email has been verified successfully."
            : `We've sent a verification link to ${email ? email : "your email address"}.`}
        </p>
      </div>

      {isVerifying && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying your email...</p>
        </div>
      )}

      {!isVerifying && !isVerified && !hasToken && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-muted/30 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                <Mail className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Didn&apos;t receive the email?
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check your spam folder, or try resending the verification
                  email.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending}
            className="w-full h-11 text-sm"
          >
            {isResending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>

          {resendSuccess && (
            <p className="text-xs text-center text-emerald-600 dark:text-emerald-400">
              Verification email has been resent successfully.
            </p>
          )}
        </div>
      )}

      {!isVerifying && isVerified && (
        <div className="space-y-5">
          <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 shrink-0 mt-0.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">You&apos;re all set!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your organization has been created. Let&apos;s configure
                  your workspace.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full h-11 text-sm font-medium"
          >
            Continue to Setup
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      <a
        href={ROUTES.LOGIN}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-foreground transition-colors duration-200"
      >
        Back to sign in
      </a>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
