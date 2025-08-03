"use client";

import { useUser } from "@clerk/nextjs";
import { DataTable } from "./data-table";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";

export default function ReportsPage() {
  const { isSignedIn, isLoaded: userDataIsLoaded, user } = useUser();

  // user.emailAddresses is an array of email objects, find the primary email
  const primaryEmailObj = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  );
  const primaryEmail = primaryEmailObj?.emailAddress ?? "";

  const { data, isLoading, error } = api.report.getReportsByUser.useQuery(
    { email: primaryEmail },
    {
      enabled: userDataIsLoaded && Boolean(primaryEmail),
    },
  );

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

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Error: {error.message}
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Reports</h1>
      <DataTable data={data ?? []} />
    </div>
  );
}
