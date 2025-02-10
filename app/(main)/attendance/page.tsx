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
    // <main>
    //   <div>
    //     <AttendanceCheck />
    //     <AttendanceCheck />
    //   </div>
    // </main>
    <>
      {/* <div className=" h-screen flex flex-1 flex-col gap-2 p-2 pt-0"> */}
      <div className="grid auto-rows-min gap-8 md:grid-cols-2">
        {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
        <div>
          <AttendanceCheck />
          {/* <div className="hidden md:block">
              <MonthlyAttendance />
            </div> */}
        </div>

        {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
        <div className="">
          {/* <MonthlyAttendance /> */}
          <AttendanceTable />
        </div>
        {/* <div className="aspect-video rounded-xl bg-muted/50" /> */}
      </div>
      {/* <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <AttendanceTable />
        </div> */}
      {/* </div> */}
    </>
  );
}

export default AttendancePage;
