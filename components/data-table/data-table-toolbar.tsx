"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { statuses } from "../../app/(main)/reports/data/data";
import { DatePickerWithRange } from "./date-range-picker";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  data: TData[];
}

export function DataTableToolbar<TData>({
  table,
  data,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // const handleExport = () => {
  //   const ws = XLSX.utils.json_to_sheet(data)
  //   const wb = XLSX.utils.book_new()
  //   XLSX.utils.book_append_sheet(wb, ws, "Reports")
  //   XLSX.writeFile(wb, "attendance_reports.xlsx")
  // }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by name..."
          value={
            (table.getColumn("fullName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        <DatePickerWithRange
          onChange={(range) => {
            if (range?.from) {
              table.getColumn("checkIn")?.setFilterValue({
                from: range.from,
                to: range.to || range.from,
              });
            } else {
              table.getColumn("checkIn")?.setFilterValue(undefined);
            }
          }}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          // onClick={handleExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
