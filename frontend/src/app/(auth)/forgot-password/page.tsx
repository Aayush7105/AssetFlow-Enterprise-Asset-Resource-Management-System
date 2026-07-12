"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ROUTES } from "@/lib/constants"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsLoading(false)
    setSubmitted(true)
  }

  return (
    <Card className="border-0 shadow-none bg-transparent p-0 flex flex-col gap-0 w-full">
      <CardHeader className="text-left pb-6 p-0 flex flex-col gap-1">
        <CardTitle className="text-3xl font-bold tracking-tight">Reset password</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {submitted
            ? "Check your email for reset instructions"
            : "Enter your email and we'll send you a reset link"}
        </CardDescription>
      </CardHeader>
      {submitted ? (
        <CardContent className="space-y-4 p-0">
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a password reset link to your email address. Please check your inbox.
            </p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 p-0">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6 p-0">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </CardFooter>
        </form>
      )}
      <CardFooter className="justify-start pt-6 p-0">
        <a
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </a>
      </CardFooter>
    </Card>
  )
}