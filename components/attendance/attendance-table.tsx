"use client";

import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";

async function fetchAttendance(
  page: number = 1,
  filter: string = "all",
  month: Date
) {
  const startDate = startOfMonth(month).toISOString();
  const endDate = endOfMonth(month).toISOString();

  const response = await fetch(
    `/api/attendance?page=${page}&filter=${filter}&startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
}

export function AttendanceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "attendance",
      currentPage,
      currentFilter,
      currentMonth,
      itemsPerPage,
    ],
    queryFn: () => fetchAttendance(currentPage, currentFilter, currentMonth),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading attendance records</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-500/10 text-green-500";
      case "LATE":
        return "bg-yellow-500/10 text-yellow-500";
      case "ABSENT":
        return "bg-red-500/10 text-red-500";
      case "AUTOCHECKOUT":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
    setCurrentPage(1);
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
    setCurrentPage(1);
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between pt-2">
        <CardTitle>Attendance</CardTitle>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground min-w-[120px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {/* <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / page</SelectItem>
              <SelectItem value="20">20 / page</SelectItem>
              <SelectItem value="50">50 / page</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </CardHeader>
      <CardContent className="text-sm pl-0">
        <Tabs
          value={currentFilter}
          onValueChange={setCurrentFilter}
          className="w-full"
        >
          <TabsList className="mb-4">
            <div className="grid-cols-2 md:grid-1 ">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="early">Early Leave</TabsTrigger>
              <TabsTrigger value="late">Late In</TabsTrigger>
              <TabsTrigger value="absent">Absents</TabsTrigger>
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="autocheckout">Auto Checkout</TabsTrigger>
            </div>
          </TabsList>

          <ScrollArea className="h-[605px] ">
            {data.data.map((record: AttendanceRecord) => (
              <div
                key={record.id}
                className="mb-4 grid grid-cols-[80px_1fr] gap-1 md:gap-4 rounded-lg border p-2 md:p-4 py-4"
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold">
                    {format(new Date(record.checkIn), "dd")}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(record.checkIn), "EEE")}
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="space-x-2">
                        <span className="text-xs md:text-sm text-muted-foreground">
                          Clock in
                        </span>
                        <span className="font-light md:font-medium">
                          {format(new Date(record.checkIn), "HH:mm")}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${getStatusColor(record.status)}`}
                    >
                      {record.status.toLowerCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="space-x-2">
                        <span className="text-xs md:text-sm text-muted-foreground">
                          Clock out
                        </span>
                        <span className="font-light md:font-medium">
                          {record.checkOut
                            ? format(new Date(record.checkOut), "HH:mm")
                            : "--:--"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Total hrs:
                      </span>
                      <span className="font-light md:font-medium">
                        {record.checkOut
                          ? format(
                              new Date(
                                new Date(record.checkOut).getTime() -
                                  new Date(record.checkIn).getTime()
                              ),
                              "HH:mm"
                            )
                          : "--:--"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * Number(itemsPerPage) + 1} to{" "}
              {Math.min(
                currentPage * Number(itemsPerPage),
                data.pagination.total
              )}{" "}
              of {data.pagination.total} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {/* <div className="flex items-center space-x-1">
                {Array.from({ length: data.pagination.pages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div> */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(data.pagination.pages, prev + 1)
                  )
                }
                disabled={currentPage === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
