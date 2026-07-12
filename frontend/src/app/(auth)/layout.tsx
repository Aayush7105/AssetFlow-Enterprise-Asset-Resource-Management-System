"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AuthIllustration } from "@/components/auth/auth-illustration"

const ROUTE_ORDER = ["/login", "/forgot-password", "/register-company", "/verify-email"] as const

function getDirection(prev: string, current: string): number {
  const prevIdx = ROUTE_ORDER.indexOf(prev as typeof ROUTE_ORDER[number])
  const currIdx = ROUTE_ORDER.indexOf(current as typeof ROUTE_ORDER[number])
  if (prevIdx < currIdx) return 1
  if (prevIdx > currIdx) return -1
  return 1
}

const ease = [0.25, 0.1, 0.25, 1] as const

function slideVariants(direction: number, slide: number, blur: number, enter: number) {
  return {
    initial: {
      opacity: 0,
      x: direction * slide,
      scale: 1 - (slide > 0 ? 0.02 : 0),
      filter: `blur(${blur}px)`,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: enter, ease: ease as unknown as number[] },
    },
    exit: {
      opacity: 0,
      x: -direction * slide,
      scale: 1 - (slide > 0 ? 0.02 : 0),
      filter: `blur(${blur}px)`,
      transition: { duration: Math.max(0.2, enter * 0.6), ease: ease as unknown as number[] },
    },
  }
}

function fadeVariants(enter: number, exit: number) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: enter, ease: ease as unknown as number[] } },
    exit: { opacity: 0, transition: { duration: exit, ease: ease as unknown as number[] } },
  }
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [prevPathname, setPrevPathname] = useState(pathname)
  const [direction, setDirection] = useState(1)

  const isPremiumTransition =
    (prevPathname === "/login" && pathname === "/register-company") ||
    (prevPathname === "/register-company" && pathname === "/login")

  if (pathname !== prevPathname) {
    setDirection(getDirection(prevPathname, pathname))
    setPrevPathname(pathname)
  }

  const illustrationAnim = useMemo(
    () =>
      isPremiumTransition
        ? slideVariants(direction, 120, 6, 0.5)
        : fadeVariants(0.4, 0.25),
    [isPremiumTransition, direction],
  )

  const formAnim = useMemo(
    () =>
      isPremiumTransition
        ? slideVariants(direction, 60, 4, 0.55)
        : fadeVariants(0.45, 0.3),
    [isPremiumTransition, direction],
  )

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="hidden lg:block lg:w-[60%] xl:w-[62%] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`illustration-${pathname}`}
            variants={illustrationAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <AuthIllustration pathname={pathname} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-1 lg:w-[40%] xl:w-[38%] flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={`form-${pathname}`}
            variants={formAnim}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-[420px] mx-auto my-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
