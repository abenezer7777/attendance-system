"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ReportsPage() {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", filterValue, page, pageSize],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(filterValue && { fullName: filterValue }),
      });

      const response = await fetch(`/api/reports?${params}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data.data}
            pageCount={data.pageCount}
            onFilterChange={setFilterValue}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { DataTable } from "./components/data-table";
// import { columns } from "./components/columns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DataTableToolbar } from "./components/data-table-toolbar";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { useMemo } from "react";

// export default function ReportsPage() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["reports"],
//     queryFn: async () => {
//       const response = await fetch("/api/reports");
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     },
//   });
//   const table = useReactTable({
//     data: data?.data || [], // Use the fetched data, default to empty array
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//   });

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <Card>
//         <CardHeader>
//           <CardTitle>Attendance Reports</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <DataTableToolbar table={table} data={data.data} />
//           <DataTable columns={columns} data={data.data} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
