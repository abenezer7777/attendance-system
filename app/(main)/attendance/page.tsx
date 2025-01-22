import { AttendanceCheck } from "@/components/attendance/attendance-check";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function touch() {
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="aspect-video rounded-xl bg-muted/50">
            <AttendanceCheck />
          </div>
          <div className="aspect-video rounded-xl bg-muted/50">
            <AttendanceTable />
          </div>
          {/* <div className="aspect-video rounded-xl bg-muted/50" />
      <div className="aspect-video rounded-xl bg-muted/50" /> */}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <AttendanceList />
        </div>
      </div>
    </>
  );
}

export default touch;
