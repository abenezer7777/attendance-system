// "use client";
// import Papa from "papaparse";
// import { useGetUsers } from "@/app/(main)/user/_components/user.query";
// import { Card } from "@/components/ui/card";
// import { DataTable } from "@/app/(main)/user/_components/data-table";
// import { columns } from "@/app/(main)/user/_components/columns";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { AttendanceTable } from "@/components/attendance/attendance-table";
// import { MonthlyAttendance } from "@/components/attendance/monthly-attendance";
// import { Button } from "@/components/ui/button";

// const AdminDashboard = () => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   //   React.useEffect(() => {
//   //     if (status === "authenticated" && session?.user?.role !== "ADMIN") {
//   //       router.push("/unauthorized");
//   //     }
//   //   }, [status, session, router]);

//   const { data: users = [], isLoading } = useGetUsers();

//   if (isLoading || status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="h-full flex-1 flex-col space-y-8 p-8">
//       <div className="flex items-center justify-between space-y-2">
//         <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
//       </div>

//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="p-6">
//           <h3 className="font-semibold">Total Users</h3>
//           <div className="text-3xl font-bold">{users.length}</div>
//         </Card>
//         <Card className="p-6">
//           <h3 className="font-semibold">Active Today</h3>
//           <div className="text-3xl font-bold">
//             {
//               users.filter((user) =>
//                 user.lastActive?.includes(
//                   new Date().toISOString().split("T")[0]
//                 )
//               ).length
//             }
//           </div>
//         </Card>
//         <Card className="p-6">
//           <h3 className="font-semibold">Departments</h3>
//           <div className="text-3xl font-bold">
//             {new Set(users.map((user) => user.department)).size}
//           </div>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2">
//         <Card className="p-6">
//           <h3 className="font-semibold mb-4">Monthly Attendance Overview</h3>
//           <MonthlyAttendance />
//         </Card>
//         <Card className="p-6">
//           <h3 className="font-semibold mb-4">Recent Attendance</h3>
//           <AttendanceTable limit={5} />
//         </Card>
//       </div>

//       <Card className="p-6">
//         <h3 className="font-semibold mb-4">Advanced Reports</h3>
//         <div className="grid gap-4 md:grid-cols-2 mb-6">
//           <Button
//             onClick={() => {
//               const csvData = users.map((user) => ({
//                 employeeId: user.employeeId,
//                 fullName: user.fullName,
//                 email: user.email,
//                 department: user.department,
//                 lastActive: user.lastActive,
//               }));
//               const csv = Papa.unparse(csvData);
//               const blob = new Blob([csv], { type: "text/csv" });
//               const url = window.URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = url;
//               a.download = "users-report.csv";
//               a.click();
//             }}
//           >
//             Export Users CSV
//           </Button>
//           <Button
//             onClick={async () => {
//               const response = await fetch("/api/attendance/monthly");
//               const data = await response.json();
//               const blob = new Blob([JSON.stringify(data, null, 2)], {
//                 type: "application/json",
//               });
//               const url = window.URL.createObjectURL(blob);
//               const a = document.createElement("a");
//               a.href = url;
//               a.download = "attendance-report.json";
//               a.click();
//             }}
//           >
//             Export Attendance Report
//           </Button>
//         </div>
//       </Card>

//       <Card className="p-6">
//         <h3 className="font-semibold mb-4">User Management</h3>
//         <DataTable data={users} columns={columns} />
//       </Card>
//     </div>
//   );
// };

// export default AdminDashboard;
"use client";
import Papa from "papaparse";

import { useGetUsers } from "@/app/(main)/user/_components/user.query";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/app/(main)/user/_components/data-table";
import { columns } from "@/app/(main)/user/_components/columns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { MonthlyAttendance } from "@/components/attendance/monthly-attendance";
import { Button } from "@/components/ui/button";
import { AttendanceExport } from "@/components/attendance/attendance-export";

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  //   React.useEffect(() => {
  //     if (status === "authenticated" && session?.user?.role !== "ADMIN") {
  //       router.push("/unauthorized");
  //     }
  //   }, [status, session, router]);

  const { data: users = [], isLoading } = useGetUsers();

  if (isLoading || status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        {/* <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold">Total Employee</h3>
            <div className="text-3xl font-bold">{users.length}</div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Active Today</h3>
            <div className="text-3xl font-bold">
              {
                users.filter((user: any) =>
                  user.lastActive?.includes(
                    new Date().toISOString().split("T")[0]
                  )
                ).length
              }
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold">Departments</h3>
            <div className="text-3xl font-bold">
              {new Set(users.map((user: any) => user.department)).size}
            </div>
          </Card>
        </div> */}
        <MonthlyAttendance />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* <Card className="p-6">
          <h3 className="font-semibold mb-4">Monthly Attendance Overview</h3>
          <MonthlyAttendance />
        </Card> */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Recent Attendance</h3>
          <AttendanceTable />
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Advanced Reports</h3>
          {/* <div className="grid gap-4 md:grid-cols-2 mb-6"> */}
          <AttendanceExport /> {/* Added AttendanceExport component */}
          {/* </div> */}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
