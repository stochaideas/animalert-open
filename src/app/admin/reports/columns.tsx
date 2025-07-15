import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { format } from "date-fns";

export type ReportWithUser = {
  report: {
    id: string;
    reportNumber: number;
    reportType: string;
    receiveUpdates: boolean | null;
    latitude?: number | null;
    longitude?: number | null;
    address?: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
  } | null;
};

export const columns: ColumnDef<ReportWithUser>[] = [
  {
    accessorKey: "report.reportNumber",
    header: "Report #",
    cell: ({ row }) => {
      return (
        <Link
          className="text-blue-700 hover:underline"
          href={`/${row.original.report.id}`}
        >
          {row.original.report.reportNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "report.reportType",
    header: "Type",
  },
  {
    accessorKey: "user.lastName",
    header: "Last Name",
  },
  {
    accessorKey: "user.firstName",
    header: "First Name",
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "report.address",
    header: "Address",
  },
  {
    accessorKey: "report.receiveUpdates",
    header: "User updates",
    cell: ({ row }) => {
      const receiveUpdates = row.original.report.receiveUpdates;
      return <div>{receiveUpdates ? "Yes" : "No"}</div>;
    },
  },
  {
    accessorKey: "report.createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdAt = row.original.report.createdAt;
      return (
        <div>{createdAt ? format(createdAt, "dd.MM.yyyy HH:mm:ss") : "—"}</div>
      );
    },
  },
  {
    accessorKey: "report.updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const updatedAt = row.original.report.updatedAt;
      return (
        <div>{updatedAt ? format(updatedAt, "dd.MM.yyyy HH:mm:ss") : "—"}</div>
      );
    },
  },
];
