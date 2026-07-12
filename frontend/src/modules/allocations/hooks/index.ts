"use client"

export function useAllocations() {
  return {
    getAllocations: async (_filter?: Record<string, unknown>) => {
      console.log("Get allocations placeholder")
      return []
    },
    createAllocation: async (_data: Record<string, unknown>) => {
      console.log("Create allocation placeholder")
    },
    updateAllocation: async (_id: string, _data: Record<string, unknown>) => {
      console.log("Update allocation placeholder")
    },
    returnAllocation: async (_id: string) => {
      console.log("Return allocation placeholder")
    },
  }
}