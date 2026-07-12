"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ONBOARDING_STEPS } from "@/modules/onboarding/constants"
import { useOnboardingStore } from "@/stores/onboarding.store"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { type ReactNode } from "react"
import { CheckCircle2 } from "lucide-react"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const { currentStep, completedSteps, nextStep, prevStep } = useOnboardingStore()
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      nextStep()
    } else {
      router.push(ROUTES.DASHBOARD)
    }
  }

  const handleBack = () => {
    if (currentStep === 0) {
      router.push(ROUTES.LOGIN)
    } else {
      prevStep()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2 text-success">
            <CheckCircle2 className="size-5" />
            <span className="text-sm font-semibold">Company Created</span>
          </div>
          <h1 className="text-xl font-bold">Now let&apos;s configure your workspace</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete these steps to get started</p>
        </div>

        <div className="flex items-center justify-center gap-1 mb-6">
          {ONBOARDING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  completedSteps.includes(index) && "bg-primary text-primary-foreground",
                  currentStep === index && !completedSteps.includes(index) && "bg-accent text-foreground ring-1 ring-foreground/20",
                  currentStep !== index && !completedSteps.includes(index) && "bg-secondary text-secondary-foreground"
                )}
              >
                {completedSteps.includes(index) ? (
                  <Check className="size-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5 mx-1",
                    completedSteps.includes(index) ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">{ONBOARDING_STEPS[currentStep]?.title}</h2>
              <p className="text-sm text-muted-foreground">{ONBOARDING_STEPS[currentStep]?.description}</p>
            </div>
            {children}
          </CardContent>
          <CardFooter className="justify-between border-t pt-6">
            <Button variant="outline" onClick={handleBack}>
              {currentStep === 0 ? "Cancel" : "Previous"}
            </Button>
            <Button onClick={handleNext}>
              {currentStep === ONBOARDING_STEPS.length - 1 ? "Complete Setup" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
