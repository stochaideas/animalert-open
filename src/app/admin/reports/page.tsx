"use client";

import { DataTable } from "./data-table";
import { api } from "~/trpc/react";

export default function AdminReportsPage() {
  const { data, isLoading, error } = api.report.listReportsWithUser.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Reports</h1>
      <DataTable data={data ?? []} />
    </div>
  );
}
