"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function fetchMonthlyAttendance() {
  const response = await fetch("/api/attendance/monthly");
  if (!response.ok) throw new Error("Failed to fetch monthly attendance");
  return response.json();
}

export function MonthlyAttendance() {
  const { data, isLoading, error } =
    useQuery({
      queryKey: ["monthlyAttendance"],
      queryFn: fetchMonthlyAttendance,
    }) || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading monthly attendance</div>;

  return (
    <Card className="border-x-0 px-2">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-2 gap-2 gap-x-16 md:gap-x-4 md:grid-cols-4">
        <Card className="bg-blue-100">
          <CardHeader>
            <CardTitle>{data.earlyLeave}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Early Leave</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-100">
          <CardHeader>
            <CardTitle>{data.absents}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Absents</p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardHeader>
            <CardTitle>{data.lateIn}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Late In</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100">
          <CardHeader>
            <CardTitle>{data.totalLeaves}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Leaves</p>
          </CardContent>
        </Card>
      </div>
      <CardContent></CardContent>
    </Card>
  );
}
