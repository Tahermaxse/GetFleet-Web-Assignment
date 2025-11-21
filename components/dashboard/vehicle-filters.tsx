"use client"

import { Search, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface VehicleFiltersProps {
  statusOptions: string[]
  statusFilter: string
  onStatusChange: (status: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  allGroupsChecked: boolean
  onToggleAllGroups: (checked: boolean) => void
}

export function VehicleFilters({
  statusOptions,
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  allGroupsChecked,
  onToggleAllGroups,
}: VehicleFiltersProps) {

  return (
    <div className="space-y-4">
      <div className="flex w-full gap-4 overflow-x-auto border-b border-border pb-0 sm:gap-6">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`relative flex-1 pb-2 text-xs font-semibold uppercase tracking-wide transition-colors sm:pb-3 sm:text-sm sm:normal-case sm:tracking-normal md:text-base ${
              statusFilter === status ? "text-brand" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            {statusFilter === status && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-brand"></div>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transform text-muted-foreground sm:h-4 sm:w-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand sm:pl-10 sm:pr-4 sm:text-sm"
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg border border-brand bg-brand/10 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-brand/20 sm:px-4 sm:text-sm"
          onClick={() => onToggleAllGroups(!allGroupsChecked)}
        >
          <Checkbox
            id="all-groups"
            checked={allGroupsChecked}
            onCheckedChange={(checked: boolean | "indeterminate") => onToggleAllGroups(checked === true)}
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          />
          <span>All Groups</span>
          <ChevronDown className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  )
}
