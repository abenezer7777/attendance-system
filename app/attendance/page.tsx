// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { AttendanceCheck } from '@/components/attendance/attendance-check';

// export default async function AttendancePage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user) {
//     redirect('/');
//   }

//   return <AttendanceCheck />;
// }
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CheckInOut } from "@/components/attendance/check-in-out";
import { AttendanceList } from "@/components/attendance/attendance-list";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import SignOut from "@/components/auth/sign-out";
import { Navbar } from "@/components/attendance/navbar";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const locations = await prisma.location.findMany({
    where: {
      users: {
        some: {
          id: session.user.id as string,
        },
      },
    },
  });

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-6 px-4 space-y-8">
        <div className="flex justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Attendance System
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track your attendance at Ethio Telecom
            </p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Locations</h2>
          <CheckInOut locations={locations} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Records</h2>
          <AttendanceList />
        </section>
      </main>
    </>
  );
}
