"use client"

import React from "react"
import { Boxes, Package, Calendar, Wrench, BarChart3 } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left panel - Dark Theme (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-white text-black">
            <Boxes className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">AssetFlow</span>
        </div>

        <div className="relative z-10 my-auto max-w-xl space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Manage every asset, <br />
            from one unified platform.
          </h1>
          <p className="text-neutral-400 text-base xl:text-lg leading-relaxed">
            Streamline your asset lifecycle, resource allocation, and maintenance workflows with enterprise-grade tools built for modern teams.
          </p>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-white/5 border border-white/10">
                <Package className="size-4 text-neutral-300" />
              </div>
              <span className="text-sm font-medium text-neutral-300">Asset Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-white/5 border border-white/10">
                <Calendar className="size-4 text-neutral-300" />
              </div>
              <span className="text-sm font-medium text-neutral-300">Resource Booking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-white/5 border border-white/10">
                <Wrench className="size-4 text-neutral-300" />
              </div>
              <span className="text-sm font-medium text-neutral-300">Maintenance Workflow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-md bg-white/5 border border-white/10">
                <BarChart3 className="size-4 text-neutral-300" />
              </div>
              <span className="text-sm font-medium text-neutral-300">Enterprise Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Light Theme */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 xl:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Header (Black and White Theme) */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AssetFlow</span>
          </div>

          <div className="hidden lg:flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">AssetFlow</span>
          </div>

          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}