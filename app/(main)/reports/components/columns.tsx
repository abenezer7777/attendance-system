"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export type Report = {
  id: string;
  employeeId: string;
  fullName: string;
  checkIn: string;
  checkOut: string | null;
  location: string;
  locationCategory: string;
  building: string;
  division: string | null;
  department: string | null;
  section: string | null;
  status:
    | "CHECKED_IN"
    | "EARLY_LEAVE"
    | "PRESENT"
    | "LATE"
    | "ABSENT"
    | "AUTO_CHECKOUT";
};

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
    accessorKey: "division",
    header: "Division",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "section",
    header: "Section",
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
      const checkOutValue = row.getValue("checkOut");

      if (!checkOutValue) {
        return "-"; // Or some other placeholder
      }

      try {
        const date = new Date(checkOutValue as string | number); // Explicitly cast to string or number

        if (isNaN(date.getTime())) {
          return "Invalid Date"; // Handle invalid date strings
        }

        return format(date, "PPp");
      } catch (error) {
        console.error("Error formatting checkOut date:", error);
        return "Error"; // Or some other error message
      }
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
    accessorKey: "building",
    header: "Building",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        {
          PRESENT: "success",
          LATE: "warning",
          ABSENT: "destructive",
          EARLY_LEAVE: "warning",
          AUTO_CHECKOUT: "default",
          CHECKED_IN: "info",
        }[status] || "default";

      return (
        <Badge variant={variant as any}>{status.replace(/_/g, " ")}</Badge>
      );
    },
  },
];
