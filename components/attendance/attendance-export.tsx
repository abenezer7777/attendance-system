"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Papa from "papaparse";
import { useGetUsers } from "@/app/(main)/user/_components/user.query";
// Import the toast hook from your shadcn UI setup
import { useToast } from "@/hooks/use-toast";

export function AttendanceExport() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  // Default values so the select components never receive an empty value.
  const [division, setDivision] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const { data: users = [] } = useGetUsers();
  const { toast } = useToast();

  // Extract unique departments from users list.
  const divisions: string[] = Array.from(
    new Set(users.map((user: any) => user.division))
  );

  // Optional: Reset selected user when department changes.
  // useEffect(() => {
  //   setSelectedUser("all");
  // }, [department]);

  // Filter users based on selected department.
  const filteredUsers =
    division === "all"
      ? users
      : users.filter((user: any) => user.division === division);

  const handleExport = async () => {
    // If dates are missing, show a toast and do not proceed.
    if (!startDate || !endDate) {
      toast({
        title: "Dates Missing",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Only add filters if a specific department or user is selected.
    if (division !== "all") params.append("division", division);
    if (selectedUser !== "all") params.append("userId", selectedUser);

    try {
      const response = await fetch(
        `/api/attendance/export?${params.toString()}`
      );

      // If the response status is not OK, show an error toast.
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Export error:", errorResponse.error);
        toast({
          title: "Export Error",
          description: errorResponse.error || "Export failed.",
          variant: "destructive",
        });
        return;
      }

      const { data } = await response.json();

      // If no records are found, show an info toast.
      if (!data || data.length === 0) {
        console.log(
          "No records found for the selected date range and filters."
        );
        toast({
          title: "No Records Found",
          description:
            "No records found for the selected date range and filters.",
          variant: "default",
        });
        return;
      }

      // Map the records to a CSV-friendly format.
      const csvData = data.map((record: any) => ({
        "Employee ID": record.user.employeeId,
        "Employee Name": record.user.fullName,
        Division: record.user.division,
        Email: record.user.email,
        Date: format(new Date(record.checkIn), "yyyy-MM-dd"),
        "Check In": format(new Date(record.checkIn), "HH:mm:ss"),
        "Check Out": record.checkOut
          ? format(new Date(record.checkOut), "HH:mm:ss")
          : "N/A",
        Status: record.status,
        "Total Hours": record.checkOut
          ? (
              (new Date(record.checkOut).getTime() -
                new Date(record.checkIn).getTime()) /
              (1000 * 60 * 60)
            ).toFixed(2)
          : "N/A",
      }));

      // Generate and download the CSV file.
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${format(
        startDate,
        "yyyy-MM-dd"
      )}-to-${format(endDate, "yyyy-MM-dd")}.csv`;
      a.click();

      // Show a success toast.
      toast({
        title: "Export Successful",
        description: "CSV file downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export Error",
        description: "Error exporting report. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Attendance Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              className="rounded-md border"
            />
          </div>
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Filter */}
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Division" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {(divisions ?? []).filter(Boolean).map((dept: string) => (
                <SelectItem key={String(dept)} value={String(dept)}>
                  {String(dept)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employee Filter */}
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {filteredUsers.map((user: any) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.fullName || "Unnamed Employee"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button
          className="w-full"
          onClick={handleExport}
          disabled={!startDate || !endDate}
        >
          Export Report
        </Button>
      </CardContent>
    </Card>
  );
}
