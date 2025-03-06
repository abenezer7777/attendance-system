"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export type Report = {
  id: string
  employeeId: string
  fullName: string
  checkIn: string
  checkOut: string | null
  location: string
  locationCategory: string
  organization: string
  status: 'EARLYLEAVE' | 'PRESENT' | 'LATE' | 'ABSENT' | 'AUTOCHECKOUT'
}

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "organization",
    header: "Organization",
  },
  {
    accessorKey: "checkIn",
    header: "Check In",
    cell: ({ row }) => format(new Date(row.getValue("checkIn")), "PPp"),
  },
  {
    accessorKey: "checkOut",
    header: "Check Out",
    cell: ({ row }) => {
      const value = row.getValue("checkOut")
      return value ? format(new Date(value), "PPp") : "-"
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div>
        <div>{row.getValue("location")}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.locationCategory}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = {
        PRESENT: "success",
        LATE: "warning",
        ABSENT: "destructive",
        EARLYLEAVE: "warning",
        AUTOCHECKOUT: "default",
      }[status] || "default"

      return (
        <Badge variant={variant as any}>
          {status.replace(/_/g, ' ')}
        </Badge>
      )
    },
  },
]