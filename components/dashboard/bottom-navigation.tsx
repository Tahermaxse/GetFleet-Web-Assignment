"use client"

import { Radio,AlertCircle, Bell, EllipsisVertical } from "lucide-react"
import { TbRoute } from "react-icons/tb";
export function BottomNavigation() {
  return (
    <div className="border-t border-border bg-card">
      <div className="flex items-center justify-around py-4">
        <button className="flex flex-col items-center gap-1 px-4 text-brand hover:opacity-80 transition-opacity">
          <Radio className="w-5 h-5" />
          <span className="text-xs font-medium">Live</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 text-muted-foreground hover:text-brand transition-colors">
          <TbRoute className="w-5 h-5" />
          <span className="text-xs font-medium">Trips</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 text-muted-foreground hover:text-brand transition-colors">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-medium">Reports</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 text-muted-foreground hover:text-brand transition-colors">
          <Bell className="w-5 h-5" />
          <span className="text-xs font-medium">Reminders</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 text-muted-foreground hover:text-brand transition-colors">
          <EllipsisVertical className="w-5 h-5" />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </div>
  )
}

