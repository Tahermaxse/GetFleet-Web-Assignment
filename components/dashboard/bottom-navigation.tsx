"use client"

import { Radio, AlertCircle, Bell, EllipsisVertical } from "lucide-react"
import { TbRoute } from "react-icons/tb"

type BottomNavigationProps = {
  onLiveClick?: () => void
}

export function BottomNavigation({ onLiveClick }: BottomNavigationProps) {
  return (
    <div className="relative z-[10000] border-t border-border bg-card pb-2 sm:pb-3">
      <div className="flex items-center justify-around py-4">
        <button
          onClick={onLiveClick}
          className="flex flex-col items-center gap-1 px-3 text-brand transition-opacity hover:opacity-80 sm:px-4"
        >
          <Radio className="h-5 w-5" />
          <span className="text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal">
            Live
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 text-muted-foreground transition-colors hover:text-brand sm:px-4">
          <TbRoute className="h-5 w-5" />
          <span className="text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal">
            Trips
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 text-muted-foreground transition-colors hover:text-brand sm:px-4">
          <AlertCircle className="h-5 w-5" />
          <span className="text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal">
            Reports
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 text-muted-foreground transition-colors hover:text-brand sm:px-4">
          <Bell className="h-5 w-5" />
          <span className="text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal">
            Reminders
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 text-muted-foreground transition-colors hover:text-brand sm:px-4">
          <EllipsisVertical className="h-5 w-5" />
          <span className="text-[11px] font-medium uppercase tracking-wide sm:text-xs sm:normal-case sm:tracking-normal">
            More
          </span>
        </button>
      </div>
    </div>
  )
}

