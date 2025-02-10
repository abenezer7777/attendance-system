import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import SignOut from "@/components/auth/sign-out";
import { AttendanceTable } from "@/components/attendance/attendance-table";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="w-full ">
      {/* <h1 className="text-3xl font-bold">Dashboard</h1> */}

      <AttendanceTable />
    </main>
  );
}
