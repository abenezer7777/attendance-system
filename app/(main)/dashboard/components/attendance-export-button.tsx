"use client";

import { useState } from "react";
import { format } from "date-fns";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CalendarDateRangePicker } from "@/app/(main)/dashboard/components/date-range-picker";
import { useGetUsers } from "@/app/(main)/user/_components/user.query";

export function AttendanceExportButton() {
  // Date range state from the calendar picker
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  // Filter state for division and employee
  const [division, setDivision] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  // Fetch all users
  const { data: users = [] } = useGetUsers();

  // Compute unique divisions from the users list
  const divisions: string[] = Array.from(
    new Set(users.map((user: any) => user.division))
  );

  // Filter users based on selected division
  const filteredUsers =
    division === "all"
      ? users
      : users.filter((user: any) => user.division === division);

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Dates Missing",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    const params = new URLSearchParams({
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    // Append division filter if not set to "all"
    if (division !== "all") {
      params.append("division", division);
    }
    // Append employee filter if not set to "all"
    if (selectedUser !== "all") {
      params.append("userId", selectedUser);
    }

    try {
      const response = await fetch(
        `/api/attendance/export?${params.toString()}`
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        toast({
          title: "Export Error",
          description: errorResponse.error || "Export failed.",
          variant: "destructive",
        });
        return;
      }
      const { data } = await response.json();
      if (!data || data.length === 0) {
        toast({
          title: "No Records Found",
          description:
            "No records found for the selected date range and filters.",
          variant: "default",
        });
        return;
      }

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

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${format(
        dateRange.from,
        "yyyy-MM-dd"
      )}-to-${format(dateRange.to, "yyyy-MM-dd")}.csv`;
      a.click();

      toast({
        title: "Export Successful",
        description: "CSV file downloaded successfully.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Export Error",
        description: "Error exporting report. Please try again later.",
        variant: "destructive",
      });
    }
  };
  const handleDateRangeChange = (
    date: { from?: Date; to?: Date } | undefined
  ) => {
    setDateRange(date || {});
  };

  return (
    // <div className="flex flex-row items-center gap-4">
    <div className="grid grid-cols-2 gap-4 ">
      {/* Date Range Picker */}
      <CalendarDateRangePicker onChange={handleDateRangeChange} />

      {/* Division Filter */}
      <Select value={division} onValueChange={setDivision}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by Division" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Divisions</SelectItem>
          {(divisions ?? []).filter(Boolean).map((dept: string) => (
            <SelectItem key={dept} value={dept}>
              {dept}
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

      {/* Download Button */}
      <Button onClick={handleExport}>Download</Button>
    </div>
  );
}
