"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/lib/constants"
import { useAuth } from "@/modules/auth/hooks"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react"

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

  const doVerify = useCallback(async (token: string) => {
    setIsVerifying(true)
    try {
      await verifyEmail(token, email)
      setIsVerified(true)
    } finally {
      setIsVerifying(false)
    }
  }, [verifyEmail, email])

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
    <Card className="border-0 shadow-none bg-transparent p-0 flex flex-col gap-0 w-full">
      <CardHeader className="text-left pb-6 p-0 flex flex-col gap-2">
        <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
          {isVerified ? (
            <CheckCircle2 className="size-7 text-foreground" />
          ) : (
            <Mail className="size-7 text-foreground" />
          )}
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {isVerified ? "Email verified" : "Check your email"}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {isVerified
            ? "Your email has been verified successfully. You can now set up your workspace."
            : `We've sent a verification link to ${email ? email : "your email address"}. Please check your inbox.`}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-0 pb-6">
        {isVerifying && (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="size-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {!isVerifying && !isVerified && !hasToken && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Didn't receive the email?</p>
                <p className="text-xs text-muted-foreground">
                  Check your spam folder, or try resending the verification email.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isVerifying && isVerified && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-5 text-foreground mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">You're all set!</p>
                <p className="text-xs text-muted-foreground">
                  Your organization has been created. Let's configure your workspace.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 p-0">
        {isVerified && (
          <Button onClick={handleContinue} className="w-full">
            Continue to Setup
            <ArrowRight className="size-4" />
          </Button>
        )}

        {!isVerifying && !isVerified && !hasToken && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending}
            className="w-full"
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
        )}

        {resendSuccess && (
          <p className="text-xs text-left text-emerald-600 dark:text-emerald-400">
            Verification email has been resent successfully.
          </p>
        )}

        <a
          href={ROUTES.LOGIN}
          className="text-sm text-muted-foreground hover:text-foreground font-medium"
        >
          Back to sign in
        </a>
      </CardFooter>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}