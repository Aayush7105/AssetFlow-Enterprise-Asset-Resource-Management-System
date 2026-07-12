"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Laptop,
  Users,
  Wrench,
  CalendarDays,
  ArrowRight,
  Shield,
} from "lucide-react"
import { ROUTES } from "@/lib/constants"

function IllustrationBackground() {
  return (
    <div className="absolute inset-0 bg-[#09090B] overflow-hidden">
      {/* Grid Pattern with radial mask */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #27272A 1px, transparent 1px),
            linear-gradient(to bottom, #27272A 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(circle 500px at 50% 50%, white, transparent 90%)",
          WebkitMaskImage: "radial-gradient(circle 500px at 50% 50%, white, transparent 90%)",
        }}
      />

      {/* Subtle pulsing grid lines or glowing spots */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.22, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none"
      />

      {/* Edge Fading Mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-transparent to-[#09090B] pointer-events-none" />
    </div>
  )
}

const infoCards = [
  {
    title: "Assets",
    description: "Track hardware lifecycle, location custody, and asset conditions in real-time.",
    icon: Laptop,
  },
  {
    title: "Employees",
    description: "Assign workspaces, manage workforce departments, and update permissions.",
    icon: Users,
  },
  {
    title: "Maintenance",
    description: "Schedule system repairs, log service records, and verify asset integrity.",
    icon: Wrench,
  },
  {
    title: "Bookings",
    description: "Book shared enterprise equipment, meeting rooms, and team workspaces.",
    icon: CalendarDays,
  },
]

export function AuthIllustration({ pathname }: { pathname: string }) {
  const isRegister = pathname === "/register-company"

  return (
    <div className="relative h-full w-full flex flex-col justify-between p-10 lg:p-16 overflow-hidden select-none">
      <IllustrationBackground />

      {/* TOP: Brand / Badge */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-xs">
            <svg className="size-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">AssetFlow</span>
        </div>
      </div>

      {/* MIDDLE: Hero Heading + Subtitle + 2x2 Cards Grid */}
      <div className="relative z-10 max-w-xl my-auto space-y-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#18181B]/80 border border-[#27272A] text-neutral-300 backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-white animate-pulse" />
            Unified Workspace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl lg:text-[46px] font-semibold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400"
          >
            {isRegister ? (
              <>
                Build your organization,
                <br />
                invite your workforce.
              </>
            ) : (
              <>
                Manage every asset,
                <br />
                from one unified workspace.
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[14px] text-neutral-400 leading-relaxed max-w-lg"
          >
            {isRegister ? (
              "Set up your company workspace in minutes. Configure asset categories, establish organization departments, and provision access permissions."
            ) : (
              "Track assets, departments, maintenance, resource bookings and enterprise operations through one intelligent platform."
            )}
          </motion.p>
        </div>

        {/* 2x2 Info Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
        >
          {infoCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="group p-4 rounded-xl border border-[#27272A] bg-[#18181B]/40 backdrop-blur-md hover:bg-[#202024]/60 hover:border-neutral-500 transition-all duration-300 shadow-sm"
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-900 border border-[#27272A] text-neutral-300 group-hover:text-white transition-colors">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="font-semibold text-[13px] text-white tracking-tight">{card.title}</h3>
                </div>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  {card.description}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* BOTTOM-LEFT: Registration Link or Home Link */}
      <div className="relative z-10">
        {!isRegister ? (
          <Link
            href={ROUTES.REGISTER_COMPANY}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            New to AssetFlow? Register your Organization
            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer group"
          >
            Already registered? Log in to your workspace
            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  )
}
