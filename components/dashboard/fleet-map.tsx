"use client"

import { memo } from "react"
import type { ComponentType } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"

import type { DeviceLocation } from "@/lib/api/getfleet"
import { cn } from "@/lib/utils"

type FleetMapProps = {
  points: DeviceLocation[]
  className?: string
  activeDeviceName?: string | null
}

const defaultCenter: [number, number] = [20.5937, 78.9629]

const LeafletMapContainer = MapContainer as unknown as ComponentType<any>
const LeafletTileLayer = TileLayer as unknown as ComponentType<any>
const LeafletCircleMarker = CircleMarker as unknown as ComponentType<any>

function FleetMapComponent({ points, className, activeDeviceName }: FleetMapProps) {
  const center = points.length ? ([points[0].position.latitude, points[0].position.longitude] as [number, number]) : defaultCenter
  const zoom = points.length ? 5 : 3

  return (
    <div className={cn("h-[420px] w-full overflow-hidden  border border-slate-200 shadow-lg", className)}>
      <LeafletMapContainer center={center} zoom={zoom} zoomControl={false} className="h-full w-full" scrollWheelZoom={true}>
        <LeafletTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map(({ device, position }) => {
          const isActive = activeDeviceName ? device.name === activeDeviceName : false
          const color = isActive ? "#4C1D95" : "#635BFF"
          const radius = isActive ? 12 : 10

          return (
            <LeafletCircleMarker
              key={device.id}
              center={[position.latitude, position.longitude]}
              radius={radius}
              color={color}
              fillColor={color}
              fillOpacity={0.75}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-slate-900">{device.name}</p>
                  <p className="text-slate-600">Status: {device.status ?? "Unknown"}</p>
                  <p className="text-slate-600">Speed: {position.speed ?? 0} km/h</p>
                  {position.address && <p className="text-slate-500">{position.address}</p>}
                </div>
              </Popup>
            </LeafletCircleMarker>
          )
        })}
      </LeafletMapContainer>
    </div>
  )
}

const FleetMap = memo(FleetMapComponent)

export default FleetMap

