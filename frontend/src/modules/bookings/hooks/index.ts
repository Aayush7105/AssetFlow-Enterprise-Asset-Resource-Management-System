"use client"

import { bookingService } from "@/modules/bookings/services"

export function useBookings() {
  return bookingService
}
