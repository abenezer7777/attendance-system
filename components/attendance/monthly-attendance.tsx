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
    <Card className="border-x-0 px-2  border-none">
      <CardHeader className="mb-4">
        <CardTitle className="text-lg md:text-2xl ">Attendance</CardTitle>
        <CardDescription>Current Month</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-2 gap-2 gap-x-16 md:gap-x-4 md:grid-cols-4">
        <Card className="border-x-0 border-b-0 bg-blue-50 border-t-4 border-t-blue-600 text-blue-600">
          <CardHeader className="">
            <CardTitle className="text-lg md-text-xl ">
              {data.earlyLeave}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Present</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-t-4 border-t-purple-600 text-purple-600 border-x-0 border-b-0">
          <CardHeader>
            <CardTitle className="text-lg md-text-xl ">
              {data.absents}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Absents</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-t-4 border-t-red-600 text-red-600 border-x-0 border-b-0">
          <CardHeader>
            <CardTitle className="text-lg md-text-xl ">{data.lateIn}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Late In</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-t-4 border-t-yellow-600 text-yellow-600 border-x-0 border-b-0">
          <CardHeader>
            <CardTitle className="text-lg md-text-xl">
              {data.totalLeaves}
            </CardTitle>
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
