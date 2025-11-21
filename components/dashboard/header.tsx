"use client"

import { Bell, Globe, ChevronDown } from "lucide-react"

export function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex-1"></div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-muted border border-bg-muted rounded-lg transition-colors">
          <Bell className="w-4 h-4 text-brand" />
        </button>

        <button className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors border border-border">
          <Globe className="w-4 h-4 text-foreground" />
          <ChevronDown className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  )
}
