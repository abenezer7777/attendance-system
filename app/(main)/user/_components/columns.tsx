"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../../../components/ui/checkbox";

// import { organizationSchema } from "../../letters/data/schema";
// import { OrganizationDto } from "../org.query";
import { DataTableColumnHeader } from "@/app/(main)/user/_components/data-table-column-header";

import { z } from "zod";
import { DataTableRowActions } from "./data-table-row-action";

// type Organization = z.infer<typeof organizationSchema>;

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
  },

  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "username",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Username" />
  //   ),
  // },

  {
    accessorKey: "role.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      return role?.name || "-";
    },
  },
  {
    accessorKey: "employeeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
  },
  // {
  //   accessorKey: "role.abilities.action==create",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Role" />
  //   ),
  // },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
