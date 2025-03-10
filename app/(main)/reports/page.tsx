"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

export default function ReportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
  const table = useReactTable({
    data: data?.data || [], // Use the fetched data, default to empty array
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          <DataTableToolbar table={table} data={data.data} />
          <DataTable columns={columns} data={data.data} />
        </CardContent>
      </Card>
    </div>
  );
}
