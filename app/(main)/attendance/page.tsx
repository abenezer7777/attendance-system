import { AttendanceCheck } from "@/components/attendance/attendance-check";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { MonthlyAttendance } from "@/components/attendance/monthly-attendance";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function AttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  return (
    <>
      <div className="grid auto-rows-min gap-8 md:grid-cols-2">
        <div>
          <AttendanceCheck />
        </div>
        <div className="">
          <AttendanceTable />
        </div>
      </div>
    </>
  );
}

export default AttendancePage;
