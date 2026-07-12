import { create } from "zustand"

interface OnboardingState {
  currentStep: number
  completedSteps: number[]
  nextStep: () => void
  prevStep: () => void
  markStepCompleted: (step: number) => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 0,
  completedSteps: [],
  nextStep: () =>
    set((s) => {
      const next = Math.min(s.currentStep + 1, 4)
      return { currentStep: next }
    }),
  prevStep: () =>
    set((s) => {
      const prev = Math.max(s.currentStep - 1, 0)
      return { currentStep: prev }
    }),
  markStepCompleted: (step) =>
    set((s) => ({
      completedSteps: s.completedSteps.includes(step)
        ? s.completedSteps
        : [...s.completedSteps, step],
    })),
}))