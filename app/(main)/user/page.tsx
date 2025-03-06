"use client";
import React from "react";
import { useGetUsers } from "@/app/(main)/user/_components/user.query";

// import { OrgForm } from "./OrgForm";
import { DataTable } from "@/app/(main)/user/_components/data-table";
import { columns } from "@/app/(main)/user/_components/columns";
import { CreateUserForm } from "./_components/createUserForm";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { CSVUpload } from "./_components/csv-upload";

const userPage = () => {
  // Always call hooks at the top level
  const { data: session, status } = useSession(); // session hook
  const router = useRouter();
  const { data: user = [], isLoading: usersLoading } = useGetUsers(); // always call this hook
  console.log("session from user", session);

  // Use effect for redirection if user role is not authorized
  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.role.name === "EMPLOYEE") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  // Conditionally render loading state after hooks have been called
  if (status === "loading" || usersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-muted-foreground">
            Here&apos;s a list of Users!
          </h1>
        </div>
        <div className="flex items-center gap-3 ">
          <CreateUserForm />
          <CSVUpload />
          <Button
            onClick={() => {
              const csvData = user.map((user: any) => ({
                employeeId: user.employeeId,
                fullName: user.fullName,
                email: user.email,
                department: user.department,
                lastActive: user.lastActive,
              }));
              const csv = Papa.unparse(csvData);
              const blob = new Blob([csv], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "users-report.csv";
              a.click();
            }}
          >
            Export Users CSV
          </Button>
        </div>
      </div>
      <DataTable data={user || []} columns={columns} />
    </div>
  );
};

export default userPage;
