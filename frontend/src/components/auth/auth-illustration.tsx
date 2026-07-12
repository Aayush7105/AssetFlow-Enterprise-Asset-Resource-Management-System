"use client"

import {
  Box,
  CalendarCheck,
  BarChart3,
  Wrench,
  Shield,
} from "lucide-react"
import type { ReactNode } from "react"

function IllustrationBackground({ variant }: { variant: "login" | "register" }) {
  const gradientFrom = variant === "login" ? "from-[#0a0a0b]" : "from-[#0a0a0b]"
  const gradientVia = variant === "login" ? "via-[#111113]" : "via-[#0e0e10]"
  const gradientTo = variant === "login" ? "to-[#18181b]" : "to-[#151518]"

  return (
    <div className="absolute inset-0">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`} />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        <defs>
          <pattern id={`grid-${variant}`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} />
      </svg>

      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-[100px]" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[80px]" />
      <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] rounded-full bg-white/[0.02] blur-[80px]" />

      <div className="absolute top-[15%] right-[12%] w-2 h-2 rounded-full bg-white/20" />
      <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/15" />
      <div className="absolute top-[60%] left-[20%] w-2.5 h-2.5 rounded-full bg-white/10" />
      <div className="absolute bottom-[25%] right-[15%] w-1.5 h-1.5 rounded-full bg-white/20" />
      <div className="absolute top-[45%] left-[40%] w-1 h-1 rounded-full bg-white/25" />

      <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
        <line x1="15%" y1="15%" x2="88%" y2="35%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="20%" y1="60%" x2="85%" y2="25%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="40%" y1="45%" x2="75%" y2="75%" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  )
}

function LoginContent() {
  return (
    <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AssetFlow</span>
        </div>
      </div>

      <div className="space-y-6 max-w-md">
        <h2 className="text-3xl lg:text-4xl font-bold text-white leading-[1.15] tracking-tight">
          Manage every asset,
          <br />
          <span className="text-white/60">from one unified platform.</span>
        </h2>
        <p className="text-white/40 text-sm lg:text-base leading-relaxed">
          Streamline your asset lifecycle, resource allocation, and maintenance
          workflows with enterprise-grade tools built for modern teams.
        </p>
      </div>

      <div className="space-y-4">
        <div className="h-px bg-white/10" />
        <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
          <FeatureItem icon={<Box className="size-4" />} label="Asset Tracking" />
          <FeatureItem icon={<CalendarCheck className="size-4" />} label="Resource Booking" />
          <FeatureItem icon={<Wrench className="size-4" />} label="Maintenance Workflow" />
          <FeatureItem icon={<BarChart3 className="size-4" />} label="Enterprise Analytics" />
        </div>
      </div>
    </div>
  )
}

function RegisterContent() {
  return (
    <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AssetFlow</span>
        </div>
      </div>

      <div className="space-y-6 max-w-md">
        <h2 className="text-3xl lg:text-4xl font-bold text-white leading-[1.15] tracking-tight">
          Build your organization,
          <br />
          <span className="text-white/60">invite your team.</span>
        </h2>
        <p className="text-white/40 text-sm lg:text-base leading-relaxed">
          Set up your workspace in minutes. Define departments, configure
          asset categories, and start managing resources across your entire
          organization.
        </p>
      </div>

      <div className="space-y-4">
        <div className="h-px bg-white/10" />
        <div className="space-y-3">
          <SetupStep step="01" title="Create organization" description="Configure company details and preferences" />
          <SetupStep step="02" title="Set up workspace" description="Define categories, departments, and team members" />
          <SetupStep step="03" title="Go live" description="Start managing assets and resources immediately" />
        </div>
      </div>
    </div>
  )
}

function GenericContent() {
  return (
    <div className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AssetFlow</span>
        </div>
      </div>

      <div className="space-y-6 max-w-md">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/10">
          <Shield className="size-8 text-white/30" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-[1.2] tracking-tight">
          Secure by design.
          <br />
          <span className="text-white/50">Your data stays protected.</span>
        </h2>
      </div>

      <div className="space-y-4">
        <div className="h-px bg-white/10" />
        <p className="text-white/30 text-xs">
          Enterprise-grade security with role-based access control, audit
          trails, and encrypted data storage.
        </p>
      </div>
    </div>
  )
}

function FeatureItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-5 items-center justify-center rounded text-white/50">
        {icon}
      </div>
      <span className="text-white/60 text-sm font-medium">{label}</span>
    </div>
  )
}

function SetupStep({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex size-8 items-center justify-center rounded-lg bg-white/[0.08] border border-white/10 text-xs font-mono text-white/40">
          {step}
        </div>
        <div className="w-px flex-1 bg-white/[0.06] mt-1.5" />
      </div>
      <div className="pb-4">
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-white/35 text-xs mt-0.5">{description}</p>
      </div>
    </div>
  )
}

const illustrationVariant: Record<string, "login" | "register"> = {
  "/login": "login",
  "/register-company": "register",
  "/forgot-password": "login",
  "/verify-email": "login",
}

const contentMap = {
  login: <LoginContent />,
  register: <RegisterContent />,
}

export function AuthIllustration({ pathname }: { pathname: string }) {
  const variant = illustrationVariant[pathname] ?? "login"

  return (
    <div className="relative h-full w-full overflow-hidden">
      <IllustrationBackground variant={variant} />
      {contentMap[variant]}
      {illustrationVariant[pathname] === undefined && <GenericContent />}
    </div>
  )
}
