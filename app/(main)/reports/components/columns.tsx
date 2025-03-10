"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    filterFn: (row, id, value) => {
      const val = row.getValue(id) as string;
      return val.toLowerCase().includes((value as string).toLowerCase());
    },
  },
  {
    accessorKey: "division",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Division" />
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
  },
  {
    accessorKey: "section",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Section" />
    ),
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check In" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("checkIn")), "PPp"),
    filterFn: (row, id, value) => {
      if (!value.from) return true;
      const date = new Date(row.getValue(id));
      const from = new Date(value.from);
      const to = value.to ? new Date(value.to) : from;
      return date >= from && date <= to;
    },
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check Out" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("checkOut") as string | null;
      return value ? format(new Date(value), "PPp") : "-";
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Building" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
