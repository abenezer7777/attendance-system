"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceRecord } from "@/lib/types";
import { Card } from "../ui/card";

async function fetchAttendance(page: number = 1) {
  const response = await fetch(`/api/attendance?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
}

export function AttendanceList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => fetchAttendance(1),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading attendance records</div>;

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((record: AttendanceRecord) => (
            <TableRow key={record.id}>
              <TableCell>{format(new Date(record.checkIn), "PP")}</TableCell>
              <TableCell>{record.building.name}</TableCell>
              <TableCell>{format(new Date(record.checkIn), "pp")}</TableCell>
              <TableCell>
                {record.checkOut
                  ? format(new Date(record.checkOut), "pp")
                  : "-"}
              </TableCell>
              <TableCell>{record.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
