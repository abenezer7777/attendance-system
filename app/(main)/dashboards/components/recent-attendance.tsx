"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"

interface RecentAttendanceProps {
  data: {
    id: string
    employeeId: string
    fullName: string
    checkIn: string
    checkOut: string | null
    status: string
  }[]
}

export function RecentAttendance({ data }: RecentAttendanceProps) {
  return (
    <div className="space-y-8">
      {data?.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {item.fullName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.fullName}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(item.checkIn), "PPp")}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {item.status}
          </div>
        </div>
      ))}
    </div>
  )
}