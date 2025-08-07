"use client";

import { useUser } from "@clerk/nextjs";
import { DataTable } from "./data-table";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";

export default function ReportsPage() {
  const { isSignedIn, isLoaded: userDataIsLoaded } = useUser();

  const { data, isLoading, error } = api.report.getReportsByUser.useQuery();

  if (!userDataIsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Se încarcă...
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/sign-in");
  }

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Se încarcă...
      </div>
    );

  if (error) {
    switch (error.data?.code) {
      case "UNAUTHORIZED":
        redirect("/sign-in");
      case "NOT_FOUND":
        redirect("/not-found");
      case "FORBIDDEN":
        redirect("/forbidden");
      default:
        return (
          <div className="flex min-h-screen items-center justify-center">
            Eroare necunoscută: {error.message}
          </div>
        );
    }
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Reports</h1>
      <DataTable data={data ?? []} />
    </div>
  );
}
