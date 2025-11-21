"use client"

import { Eye, Edit2, MapPin } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { DeviceLocation } from "@/lib/api/getfleet"

interface VehicleListProps {
  selectedVehicle: string | null
  onSelectVehicle: (vehicleName: string) => void
  vehicles: DeviceLocation[]
}

export function VehicleList({ vehicles, selectedVehicle, onSelectVehicle }: VehicleListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "moving":
      case "online":
        return "bg-green-100 text-green-700"
      case "idling":
      case "idle":
        return "bg-yellow-100 text-yellow-700"
      case "stopped":
      case "offline":
        return "bg-red-100 text-red-700"
      case "no-signal":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "moving":
        return "Moving"
      case "idling":
        return "Idling"
      case "stopped":
        return "Stopped"
      case "no-signal":
        return "No Signal"
      case "online":
        return "Online"
      case "offline":
        return "Offline"
      default:
        return status
    }
  }

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Unknown"
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) return "Unknown"

    return date.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-3">
      {vehicles.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground sm:text-sm">No vehicles found</div>
      ) : (
        vehicles.map(({ device, position }) => {
          const status = (device.status ?? "unknown").toLowerCase()
          const deviceIdentifier = device.name ?? `Device #${device.id}`
          const isSelected = selectedVehicle === deviceIdentifier

          return (
          <div
            key={device.id}
            onClick={() => onSelectVehicle(deviceIdentifier)}
            className={`rounded-2xl border bg-card p-4 shadow-sm cursor-pointer transition-all ${
              isSelected ? "border-brand bg-brand/5" : "border-border hover:border-brand/60"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelectVehicle(deviceIdentifier)}
                  className="h-4 w-4 sm:h-5 sm:w-5"
                />
                <div>
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">{deviceIdentifier}</h3>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    {formatTimestamp(device.lastUpdate ?? position.deviceTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <Eye className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                </button>
                <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <Edit2 className="h-4 w-4 text-brand sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="text-xs text-muted-foreground sm:text-sm">Status:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium sm:text-xs ${getStatusColor(status)}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                  <span className="rounded-full px-3 py-1 text-[11px] font-medium text-muted-foreground sm:text-xs bg-gray-100">
                    {Math.round(position.speed ?? 0)} km/hr
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>{position.address ?? "No address available"}</span>
              </div>
            </div>
          </div>
        )})
      )}
    </div>
  )
}
