"use client";
import React from "react";
import { useGetUsers } from "@/app/(main)/user/_components/user.query";

// import { OrgForm } from "./OrgForm";
import { DataTable } from "@/app/(main)/user/_components/data-table";
import { columns } from "@/app/(main)/user/_components/columns";
import { CreateUserForm } from "./_components/createUserForm";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

const OrganizationPage = () => {
  const { data: session, status } = useSession(); // Get the user's session
  const router = useRouter();

  // Redirect if the user is not authorized
  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "USER") {
      router.push("/unauthorized"); // Redirect to an unauthorized page
    }
  }, [status, session, router]);

  // Optionally, display a loading state while checking authentication
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  const { data: user = [], isLoading } = useGetUsers();
  // console.log("user user", user.role?.name);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-muted-foreground">
            Here&apos;s a list of Users!
          </h1>
        </div>
        <div className="flex items-center ">
          <CreateUserForm />
        </div>
      </div>
      <DataTable data={user || []} columns={columns} />
    </div>
  );
};

export default OrganizationPage;
