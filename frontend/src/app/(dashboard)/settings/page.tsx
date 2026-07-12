"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Building2, Bell, Loader2, Check } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useAuthStore } from "@/stores/auth.store"
import { useSettingsStore } from "@/stores/settings.store"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const user = useAuthStore((s) => s.user)
  const updateOrganization = useAuthStore((s) => s.updateOrganization)

  const {
    emailNotifications,
    pushNotifications,
    inAppNotifications,
    setEmailNotifications,
    setPushNotifications,
    setInAppNotifications,
  } = useSettingsStore()

  const [orgName, setOrgName] = useState("")
  const [industry, setIndustry] = useState("")
  const [saveStatus, setSaveStatus] = useState<"default" | "loading" | "success">("default")
  const [isMounted, setIsMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      setOrgName(user.organizationName || "")
      setIndustry(user.industry || "Technology")
    }
  }, [user])

  if (!isMounted || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const currentOrgName = user.organizationName || ""
  const currentIndustry = user.industry || "Technology"

  const hasChanges = orgName !== currentOrgName || (industry && industry !== currentIndustry)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orgName.trim() || !industry.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name and industry are required fields.",
        variant: "destructive",
      })
      return
    }

    if (!hasChanges) {
      toast({
        title: "No changes",
        description: "No changes to save.",
      })
      return
    }

    setSaveStatus("loading")
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      updateOrganization(orgName.trim(), industry.trim())
      setSaveStatus("success")
      toast({
        title: "Settings Saved",
        description: "✓ Settings saved successfully",
      })

      setTimeout(() => {
        setSaveStatus("default")
      }, 2000)
    } catch (err) {
      setSaveStatus("default")
      toast({
        title: "Error saving settings",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggle = (type: "email" | "push" | "inApp", checked: boolean) => {
    let label = ""
    if (type === "email") {
      setEmailNotifications(checked)
      label = "Email Notifications"
    } else if (type === "push") {
      setPushNotifications(checked)
      label = "Push Notifications"
    } else if (type === "inApp") {
      setInAppNotifications(checked)
      label = "In-App Notifications"
    }

    toast({
      title: checked ? `${label} Enabled` : `${label} Disabled`,
      description: "Preferences updated in local storage.",
    })
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account and organization settings"
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                Organization
              </CardTitle>
              {hasChanges && (
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 animate-pulse bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  ● Unsaved Changes
                </span>
              )}
            </div>
            <CardDescription>Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Enter industry"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!hasChanges || saveStatus === "loading"}
                className={
                  saveStatus === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : ""
                }
              >
                {saveStatus === "loading" && (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                )}
                {saveStatus === "success" && (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Saved!
                  </>
                )}
                {saveStatus === "default" && "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border/50">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => handleToggle("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(checked) => handleToggle("push", checked)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">In-App Notifications</p>
                  <p className="text-xs text-muted-foreground">Show notifications within the app</p>
                </div>
                <Switch
                  checked={inAppNotifications}
                  onCheckedChange={(checked) => handleToggle("inApp", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
