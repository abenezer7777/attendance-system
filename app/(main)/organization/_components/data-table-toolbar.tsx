"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

// import { statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useState } from "react";
import { X } from "lucide-react";
import { OrgLevel } from "@prisma/client";
import { levels } from "@/lib/schemas/data/data";
// import { Modal } from "./AdvanceSearchModal";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  // onSearchSubmit: (params: any) => void; // New prop for search submission add for search
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Organization..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("level") && (
          <DataTableFacetedFilter
            column={table.getColumn("level")}
            title="Level"
            options={levels}
          />
        )}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
