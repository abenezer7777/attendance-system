"use client";

import { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "../../../../components/ui/badge";
import { Checkbox } from "../../../../components/ui/checkbox";

// import { labels, priorities, statuses } from "../data/data";
import { createOrganizationSchema } from "@/schemas/validationSchemaaa";
// import { OrganizationDto } from "../org.query";
import { DataTableColumnHeader } from "./data-table-column-header";
// import { DataTableRowActions } from "./data-table-row-actions";
import { z } from "zod";

type Organization = z.infer<typeof createOrganizationSchema>;

export const columns: ColumnDef<Organization>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "abbreviation",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="abbreviation" />
  //   ),
  // },

  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="level" />
    ),
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
