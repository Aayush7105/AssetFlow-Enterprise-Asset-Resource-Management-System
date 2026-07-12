"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  HelpCircle,
  Mail,
  Bug,
  Lightbulb,
  Keyboard,
  Info,
  ChevronRight,
  Search,
  ExternalLink,
} from "lucide-react"

const helpSections = [
  {
    title: "Documentation",
    description: "Browse detailed guides, API reference, and deployment docs.",
    icon: BookOpen,
  },
  {
    title: "Frequently Asked Questions",
    description: "Find quick answers to common support queries and problems.",
    icon: HelpCircle,
  },
  {
    title: "Contact Support",
    description: "Get direct assistance from our customer support engineers.",
    icon: Mail,
  },
  {
    title: "Report a Bug",
    description: "File issues you encounter so we can continuously improve.",
    icon: Bug,
  },
  {
    title: "Feature Requests",
    description: "Suggest new tools, integrations, or system improvements.",
    icon: Lightbulb,
  },
  {
    title: "Keyboard Shortcuts",
    description: "Learn global shortcuts to navigate the application instantly.",
    icon: Keyboard,
  },
  {
    title: "Version Information",
    description: "View current release version, changelogs, and system details.",
    icon: Info,
  },
]

const quickLinks = [
  { name: "Getting Started", href: "#" },
  { name: "Managing Assets", href: "#" },
  { name: "Employee Management", href: "#" },
  { name: "Bookings", href: "#" },
  { name: "Maintenance", href: "#" },
  { name: "Audits", href: "#" },
  { name: "Reports", href: "#" },
]

export default function HelpPage() {
  const [search, setSearch] = useState("")

  const filteredSections = helpSections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(search.toLowerCase()) ||
      sec.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Search documentation, browse FAQs, or reach out to our team."
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help..."
              className="pl-9 h-9 border-border/80 focus:ring-1 focus:ring-ring text-sm bg-background"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredSections.map((sec) => {
              const Icon = sec.icon
              return (
                <Card key={sec.title} className="group border border-border/60 hover:border-border transition-colors rounded-xl shadow-none hover:bg-accent/10">
                  <CardHeader className="p-5 pb-2">
                    <CardTitle className="text-[14px] font-semibold flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                        <Icon className="size-4" />
                      </div>
                      {sec.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {sec.description}
                    </p>
                    <div className="mt-3 flex items-center text-[11px] font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 cursor-pointer">
                      Open Section <ChevronRight className="size-3" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
            {filteredSections.length === 0 && (
              <div className="col-span-2 text-center py-10 text-sm text-muted-foreground">
                No matching help articles found.
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-64 shrink-0 space-y-5">
          <Card className="border border-border/60 rounded-xl shadow-none bg-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                {quickLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    {link.name}
                    <ExternalLink className="size-3 text-muted-foreground/40 group-hover:text-foreground/70 transition-colors" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t border-border/40 pt-6 text-center">
        <p className="text-[11px] text-muted-foreground/60 font-medium">AssetFlow v1.0.0</p>
      </div>
    </div>
  )
}
