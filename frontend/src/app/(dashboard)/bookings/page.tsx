"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { SearchBar } from "@/components/shared/search-bar"
import { ComboSelect } from "@/components/shared/combo-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useERPStore, Booking } from "@/stores/erp.store"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Plus,
  Calendar,
  Clock,
  Briefcase,
  Layers,
  ChevronDown,
  XOctagon,
  CalendarRange,
} from "lucide-react"

export default function BookingsPage() {
  const { toast } = useToast()
  const { bookings, assets, addBooking, rescheduleBooking, updateBookingStatus } = useERPStore()

  // State
  const [search, setSearch] = useState("")
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)

  // Forms
  const [bookForm, setBookForm] = useState({
    resource: "",
    date: "",
    startTime: "",
    endTime: "",
    department: "",
    purpose: "",
  })

  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")
      const searchParam = params.get("search")

      if (action === "book") {
        setBookForm({ resource: "", date: "", startTime: "", endTime: "", department: "", purpose: "" })
        setIsBookOpen(true)
      } else if (searchParam) {
        setSearch(searchParam)
      }
    }
  }, [])

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookForm.resource || !bookForm.date || !bookForm.startTime || !bookForm.endTime) return

    addBooking(bookForm)
    toast({ title: "Booking Created", description: `Booked "${bookForm.resource}" successfully.` })
    setIsBookOpen(false)
    setBookForm({ resource: "", date: "", startTime: "", endTime: "", department: "", purpose: "" })
  }

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeBooking || !rescheduleForm.date || !rescheduleForm.startTime || !rescheduleForm.endTime) return

    rescheduleBooking(activeBooking.id, rescheduleForm.date, rescheduleForm.startTime, rescheduleForm.endTime)
    toast({ title: "Booking Rescheduled", description: `Updated scheduling for "${activeBooking.resource}".` })
    setIsRescheduleOpen(false)
    setActiveBooking(null)
  }

  const handleCancelConfirm = () => {
    if (!activeBooking) return
    updateBookingStatus(activeBooking.id, "Cancelled")
    toast({ title: "Booking Cancelled", description: `Cancelled booking for "${activeBooking.resource}".` })
    setIsCancelOpen(false)
    setActiveBooking(null)
  }

  const handleApprove = (booking: Booking) => {
    updateBookingStatus(booking.id, "Approved")
    toast({ title: "Booking Approved", description: `Booking for "${booking.resource}" has been approved.` })
  }

  const handleReject = (booking: Booking) => {
    updateBookingStatus(booking.id, "Rejected")
    toast({ title: "Booking Rejected", description: `Booking for "${booking.resource}" has been rejected.` })
  }

  // Filter list
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.resource.toLowerCase().includes(search.toLowerCase()) ||
      b.purpose.toLowerCase().includes(search.toLowerCase()) ||
      b.department.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const statusColors = {
    Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Approved: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    Cancelled: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
    Completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resource Bookings"
        description="Book shared items, rooms, AV equipment, and manage scheduling requests"
        actions={
          <Button onClick={() => setIsBookOpen(true)} className="shadow-xs hover:-translate-y-px transition-all">
            <Plus className="size-4 mr-1.5" />
            Book Resource
          </Button>
        }
      />

      <div className="flex items-center gap-2 max-w-sm">
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-border/60 bg-card p-5 shadow-none card-hover flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <CalendarRange className="size-4" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground truncate max-w-[150px]">{booking.resource}</h3>
                </div>
                <Badge variant="outline" className={`h-5 text-[10px] font-medium rounded-full ${statusColors[booking.status]}`}>
                  {booking.status}
                </Badge>
              </div>

              <div className="space-y-2.5 text-[13px] text-muted-foreground mb-5">
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="size-3.5 text-muted-foreground/60 shrink-0" />
                  <span>{booking.purpose} · <span className="font-medium text-foreground">{booking.department}</span></span>
                </div>
              </div>
            </div>

            {booking.status !== "Cancelled" && booking.status !== "Rejected" && (
              <div className="flex items-center gap-1.5 border-t border-border/40 pt-3.5">
                {booking.status === "Pending" ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(booking)}
                      className="h-8 text-xs flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/5"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(booking)}
                      className="h-8 text-xs flex-1 text-red-600 hover:text-red-700 hover:bg-red-500/5"
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveBooking(booking)
                        setRescheduleForm({ date: booking.date, startTime: booking.startTime, endTime: booking.endTime })
                        setIsRescheduleOpen(true)
                      }}
                      className="h-8 text-xs flex-1"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setActiveBooking(booking); setIsCancelOpen(true) }}
                      className="h-8 text-xs flex-1 text-destructive hover:bg-destructive/5 hover:text-destructive"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {filteredBookings.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            No bookings found. Click "Book Resource" to add one.
          </div>
        )}
      </div>

      {/* BOOK RESOURCE DIALOG */}
      <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Shared Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <label className="text-muted-foreground block mb-1">Select Shared Resource</label>
                <ComboSelect
                  options={[
                    ...assets
                      .filter((a) => a.sharedResource)
                      .map((a) => ({ value: a.name, label: a.name, description: "Shared Device" })),
                    { value: "Conference Room A", label: "Conference Room A", description: "Shared Space" },
                    { value: "Conference Room B", label: "Conference Room B", description: "Shared Space" },
                    { value: "Design Studio Lab", label: "Design Studio Lab", description: "Lab Facility" },
                  ]}
                  value={bookForm.resource}
                  onValueChange={(val) => setBookForm({ ...bookForm, resource: val })}
                  placeholder="Select Shared Resource"
                  searchPlaceholder="Search resources..."
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-muted-foreground block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookForm.date}
                    onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
                    className="w-full h-9 px-2 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={bookForm.startTime}
                    onChange={(e) => setBookForm({ ...bookForm, startTime: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={bookForm.endTime}
                    onChange={(e) => setBookForm({ ...bookForm, endTime: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={bookForm.department}
                    onChange={(e) => setBookForm({ ...bookForm, department: e.target.value })}
                    placeholder="e.g. Engineering"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Purpose / Note</label>
                  <input
                    type="text"
                    required
                    value={bookForm.purpose}
                    onChange={(e) => setBookForm({ ...bookForm, purpose: e.target.value })}
                    placeholder="e.g. Review Session"
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsBookOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Book Resource
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* RESCHEDULE DIALOG */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-[13px]">
            <div className="grid gap-3.5">
              <div>
                <span className="text-muted-foreground block mb-1">Resource Name</span>
                <p className="font-semibold text-sm">{activeBooking?.resource}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-muted-foreground block mb-1">New Date</label>
                  <input
                    type="date"
                    required
                    value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    className="w-full h-9 px-2 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={rescheduleForm.startTime}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, startTime: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={rescheduleForm.endTime}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, endTime: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background outline-none text-sm focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CANCEL CONFIRM DIALOG */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-[13px] text-muted-foreground">
            Are you sure you want to cancel the booking for <span className="font-semibold text-foreground">"{activeBooking?.resource}"</span>?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>
              No, Keep
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm}>
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
