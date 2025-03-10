// "use client";

// import { Table } from "@tanstack/react-table";
// import { X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DataTableViewOptions } from "./data-table-view-options";

// import { statuses } from "@/lib/schemas/data/data";
// import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DatePickerWithRange } from "./date-range-picker";
// import * as XLSX from "xlsx";
// import { Download } from "lucide-react";

// interface DataTableToolbarProps<TData> {
//   table: Table<TData>;
//   // data: TData[];
// }

// export function DataTableToolbar<TData>({
//   table,
// }: // data,
// DataTableToolbarProps<TData>) {
//   const isFiltered = table.getState().columnFilters.length > 0;
//   // const handleExport = () => {
//   //   const ws = XLSX.utils.json_to_sheet(data);
//   //   const wb = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(wb, ws, "Reports");
//   //   XLSX.writeFile(wb, "attendance_reports.xlsx");
//   // };

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex flex-1 items-center space-x-2">
//         <Input
//           placeholder="Filter by Id ..."
//           value={
//             (table.getColumn("employeeId")?.getFilterValue() as string) ?? ""
//           }
//           onChange={(event) =>
//             table.getColumn("employeeId")?.setFilterValue(event.target.value)
//           }
//           className="h-8 w-[150px] lg:w-[250px]"
//         />
//         {table.getColumn("status") && (
//           <DataTableFacetedFilter
//             column={table.getColumn("status")}
//             title="Status"
//             options={statuses}
//           />
//         )}
//         <DatePickerWithRange
//           onChange={(range) => {
//             if (range?.from) {
//               table.getColumn("checkIn")?.setFilterValue({
//                 from: range.from,
//                 to: range.to || range.from,
//               });
//             } else {
//               table.getColumn("checkIn")?.setFilterValue(undefined);
//             }
//           }}
//         />
//         {/* {table.getColumn("priority") && (
//           <DataTableFacetedFilter
//             column={table.getColumn("priority")}
//             title="Priority"
//             options={priorities}
//           />
//         )} */}
//         {isFiltered && (
//           <Button
//             variant="ghost"
//             onClick={() => table.resetColumnFilters()}
//             className="h-8 px-2 lg:px-3"
//           >
//             Reset
//             <X />
//           </Button>
//         )}
//       </div>
//       <div className="flex items-center space-x-2">
//         {/* <Button
//           variant="outline"
//           size="sm"
//           className="h-8"
//           onClick={handleExport}
//         >
//           <Download className="mr-2 h-4 w-4" />
//           Export
//         </Button> */}
//         <DataTableViewOptions table={table} />
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { statuses } from "@/lib/schemas/data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DatePickerWithRange } from "./date-range-picker";
import { Download } from "lucide-react";

// Custom hook to debounce input values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [filterValue, setFilterValue] = useState("");
  const debouncedFilterValue = useDebounce(filterValue, 300);

  // Update the table filter only after the debounced value changes.
  useEffect(() => {
    table.getColumn("employeeId")?.setFilterValue(debouncedFilterValue);
  }, [debouncedFilterValue, table]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by Id ..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
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
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
