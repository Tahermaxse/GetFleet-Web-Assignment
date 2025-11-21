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
      <div className="flex w-full gap-6 overflow-x-auto border-b border-border pb-0">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`flex-1 pb-3 font-semibold text-base whitespace-nowrap transition-colors relative ${
              statusFilter === status ? "text-brand" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
            {statusFilter === status && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <button
          className="flex items-center gap-2 rounded-lg border border-brand bg-brand/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-brand/20"
          onClick={() => onToggleAllGroups(!allGroupsChecked)}
        >
          <Checkbox
            id="all-groups"
            checked={allGroupsChecked}
            onCheckedChange={(checked: boolean | "indeterminate") => onToggleAllGroups(checked === true)}
            className="h-4 w-4"
          />
          <span>All Groups</span>
          <ChevronDown className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </div>
  )
}
