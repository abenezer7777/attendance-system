import { AttendanceCheck } from "@/components/attendance/attendance-check";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function touch() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }
  return <AttendanceCheck />;
}

export default touch;
