"use client"

import { API_BASE_PATH } from "@/lib/constants"

type SessionResponse = {
  valid: boolean
  userId?: number
  expires?: string
}

export type Device = {
  id: number
  name: string
  status?: string
  uniqueId?: string
  category?: string
  lastUpdate?: string
}

export type Position = {
  id: number
  deviceId: number
  latitude: number
  longitude: number
  speed?: number
  course?: number
  address?: string
  deviceTime?: string
  fixTime?: string
}

export type DeviceLocation = {
  device: Device
  position: Position
}

const withToken = (path: string, token: string) => {
  const hasQuery = path.includes("?")
  return `${API_BASE_PATH}${path}${hasQuery ? "&" : "?"}token=${token}`
}

const request = async <T>(path: string, token: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers ?? {})
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(withToken(path, token), {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    throw new Error(errorText || `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const validateSession = (token: string) => request<SessionResponse>("/session", token)

export const fetchDevices = (token: string) => request<Device[]>("/devices", token)

export const fetchPositions = (token: string) => request<Position[]>("/positions", token)

export const mergeDeviceLocations = (devices: Device[], positions: Position[]): DeviceLocation[] => {
  const latestPositions = positions.reduce<Record<number, Position>>((acc, position) => {
    const existing = acc[position.deviceId]
    if (!existing) {
      acc[position.deviceId] = position
      return acc
    }

    const currentTime = existing.deviceTime ?? existing.fixTime ?? ""
    const newTime = position.deviceTime ?? position.fixTime ?? ""

    if (newTime > currentTime) {
      acc[position.deviceId] = position
    }

    return acc
  }, {})

  return devices
    .map((device) => {
      const position = latestPositions[device.id]
      if (!position || typeof position.latitude !== "number" || typeof position.longitude !== "number") {
        return null
      }
      return { device, position }
    })
    .filter(Boolean) as DeviceLocation[]
}

