"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, Loader2 } from "lucide-react"

import { Header } from "@/components/dashboard/header"
import { BottomNavigation } from "@/components/dashboard/bottom-navigation"
import { MapComponent } from "@/components/dashboard/map-component"
import { VehicleFilters } from "@/components/dashboard/vehicle-filters"
import { VehicleList } from "@/components/dashboard/vehicle-list"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import {
  fetchDevices,
  fetchPositions,
  mergeDeviceLocations,
  validateSession,
  type DeviceLocation,
} from "@/lib/api/getfleet"
import { clearSessionToken, getSessionToken } from "@/lib/session"
export const dynamic = "force-dynamic"

type TabKey = "vehicles" | "drivers" | "alerts"

async function fetchFleetData(): Promise<DeviceLocation[]> {
  const token = getSessionToken()
  if (!token) {
    throw new Error("NO_TOKEN")
  }

  await validateSession(token)
  const [devices, positions] = await Promise.all([
    fetchDevices(token),
    fetchPositions(token),
  ])

  return mergeDeviceLocations(devices, positions)
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("vehicles")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [allGroupsChecked, setAllGroupsChecked] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const {
    data: points = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fleet", "devices"],
    queryFn: fetchFleetData,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: (failureCount, err) => {
      if (err instanceof Error && err.message === "NO_TOKEN") {
        return false
      }
      return failureCount < 3
    },
    meta: {
      onError: (err: Error) => {
        clearSessionToken()
        router.replace("/login")
      },
    },
  })

  const shouldRedirect = isError && error instanceof Error
  if (shouldRedirect) {
    clearSessionToken()
    router.replace("/login")
  }

  const enrichedPoints = useMemo(
    () =>
      points.map((point) => ({
        point,
        normalizedStatus: point.device.status?.toLowerCase() ?? "unknown",
      })),
    [points]
  )

  const statusOptions = useMemo(() => {
    const statuses = new Set(enrichedPoints.map((e) => e.normalizedStatus))
    return ["all", ...Array.from(statuses)]
  }, [enrichedPoints])

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return enrichedPoints
      .filter(({ normalizedStatus, point }) => {
        const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter
        if (!matchesStatus) return false
        if (!query) return true
        const identifier = (point.device.name ?? `Device #${point.device.id}`).toLowerCase()
        const location = (point.position.address ?? "").toLowerCase()
        return identifier.includes(query) || location.includes(query)
      })
      .map(({ point }) => point)
  }, [enrichedPoints, statusFilter, searchQuery])

  const errorMessage = isError ? "Unable to load fleet data. Please sign in again." : null

  return (
    <div className="flex h-screen flex-col bg-background max-w-[400px] mx-auto">
      <Header />

      <div className="relative flex-1 overflow-hidden bg-slate-50">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/80">
            <Loader2 className="h-7 w-7 animate-spin text-brand sm:h-8 sm:w-8" />
            <p className="text-xs text-muted-foreground sm:text-sm">Fetching latest positions...</p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:text-base">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {!isError && (
          <MapComponent
            points={points}
            selectedVehicle={selectedVehicle}
            className="h-full w-full"
          />
        )}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="mx-auto max-h-[75vh] max-w-[400px] rounded-t-3xl border border-border bg-background pb-4"
        style={{ zIndex: 9999 }}>
          
          <div className="flex-1 overflow-y-auto px-4 mt-3">
            <div className="mb-4 flex gap-2 rounded-xl border border-gray-300 bg-background p-1">
              {(["vehicles", "drivers", "alerts"] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:px-6 sm:py-3 sm:text-base ${
                    activeTab === tab
                      ? "bg-brand/10 text-brand"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "vehicles" && (
              <div className="space-y-4 pb-2">
                <VehicleFilters
                  statusOptions={statusOptions}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  allGroupsChecked={allGroupsChecked}
                  onToggleAllGroups={setAllGroupsChecked}
                />
                <VehicleList
                  vehicles={filteredVehicles}
                  selectedVehicle={selectedVehicle}
                  onSelectVehicle={setSelectedVehicle}
                />
              </div>
            )}

            {activeTab === "drivers" && (
              <div className="p-4 text-center text-xs text-muted-foreground sm:text-sm">
                Drivers section coming soon
              </div>
            )}

            {activeTab === "alerts" && (
              <div className="p-4 text-center text-xs text-muted-foreground sm:text-sm">
                Alerts section coming soon
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <BottomNavigation
        onLiveClick={() => {
          setDrawerOpen(true)
        }}
      />
    </div>
  )
}