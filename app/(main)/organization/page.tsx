"use client";
import React from "react";
import { useGetAllOrganizationsForTable } from "./org.query";

import { OrgForm } from "./OrgForm";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const OrganizationPage = () => {
  const { data: organizations = [], isLoading } =
    useGetAllOrganizationsForTable();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 ">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-muted-foreground">
            Here&apos;s a list of Organization!
          </h1>
        </div>
        <div className="flex items-center ">
          <OrgForm />
        </div>
      </div>
      <DataTable data={organizations || []} columns={columns} />
    </div>
  );
};

export default OrganizationPage;
