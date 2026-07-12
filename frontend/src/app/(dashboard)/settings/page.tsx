"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/auth.store"
import { useSettingsStore } from "@/stores/settings.store"
import { Building2, Bell, Loader2, Check } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const user = useAuthStore((s) => s.user)
  const updateOrganization = useAuthStore((s) => s.updateOrganization)

  const {
    industry,
    emailNotifications,
    pushNotifications,
    inAppNotifications,
    setIndustry,
    setEmailNotifications,
    setPushNotifications,
    setInAppNotifications,
    loadSettings,
  } = useSettingsStore()

  // Local state for forms
  const [orgNameInput, setOrgNameInput] = useState("")
  const [industryInput, setIndustryInput] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize inputs
  useEffect(() => {
    loadSettings()
    if (user?.organizationName) {
      setOrgNameInput(user.organizationName)
    }
  }, [user])

  useEffect(() => {
    setIndustryInput(industry)
  }, [industry])

  const hasUnsavedChanges =
    (user?.organizationName && orgNameInput !== user.organizationName) ||
    industryInput !== industry

  const handleSave = async () => {
    if (!orgNameInput.trim() || !industryInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Organization name and industry cannot be empty.",
        variant: "destructive",
      })
      return
    }

    if (!hasUnsavedChanges) {
      toast({
        title: "No changes to save.",
        description: "Your settings are already up to date.",
      })
      return
    }

    setIsSaving(true)
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      updateOrganization(orgNameInput)
      setIndustry(industryInput)
      toast({
        title: "Settings Saved",
        description: "Settings saved successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (type: "email" | "push" | "inApp", checked: boolean) => {
    if (type === "email") {
      setEmailNotifications(checked)
      toast({
        title: checked ? "Email Notifications Enabled" : "Email Notifications Disabled",
        description: checked
          ? "You will now receive system updates and alerts via email."
          : "You will no longer receive system updates via email.",
      })
    } else if (type === "push") {
      setPushNotifications(checked)
      toast({
        title: checked ? "Push Notifications Enabled" : "Push Notifications Disabled",
        description: checked
          ? "You will now receive desktop notifications from AssetFlow."
          : "You will no longer receive desktop notifications.",
      })
    } else if (type === "inApp") {
      setInAppNotifications(checked)
      toast({
        title: checked ? "In-App Notifications Enabled" : "In-App Notifications Disabled",
        description: checked
          ? "You will see notification alerts directly inside the application."
          : "You will no longer see notifications inside the app.",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Settings"
          description="Manage your account and organization settings"
        />
        {hasUnsavedChanges && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
            <span className="size-1.5 rounded-full bg-amber-500" />
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="grid gap-6">
        <Card className="border border-border/60 rounded-xl shadow-none">
          <CardHeader className="p-6">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              Organization
            </CardTitle>
            <CardDescription className="text-xs">Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Organization Name</Label>
                <Input
                  value={orgNameInput}
                  onChange={(e) => setOrgNameInput(e.target.value)}
                  className="h-9 focus:ring-1 focus:ring-ring text-sm"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Industry</Label>
                <Input
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  className="h-9 focus:ring-1 focus:ring-ring text-sm"
                  disabled={isSaving}
                />
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="h-9 shadow-xs min-w-32"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/60 rounded-xl shadow-none">
          <CardHeader className="p-6">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-xs">Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="divide-y divide-border/50">
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(checked) => handleToggle("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive push notifications in browser</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(checked) => handleToggle("push", checked)}
                />
              </div>
              <div className="flex items-center justify-between py-3.5">
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
