import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

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

// Define fixed widths for each column (in px)
const COLUMN_WIDTHS = {
  reportNumber: 110,
  reportType: 100,
  lastName: 120,
  firstName: 120,
  phone: 130,
  email: 180,
  address: 200,
  receiveUpdates: 110,
  createdAt: 170,
  updatedAt: 170,
};

export const columns: ColumnDef<ReportWithUser>[] = [
  {
    id: "reportNumber",
    accessorKey: "report.reportNumber",
    header: "Report #",
    size: COLUMN_WIDTHS.reportNumber,
    cell: ({ row }) => {
      return (
        <Link
          className="text-blue-700 hover:underline"
          href={`/admin/reports/${row.original.report.id}`}
        >
          {row.original.report.reportNumber}
        </Link>
      );
    },
  },
  {
    id: "reportType",
    accessorKey: "report.reportType",
    header: "Type",
    size: COLUMN_WIDTHS.reportType,
  },
  {
    id: "lastName",
    accessorKey: "user.lastName",
    header: "Last Name",
    size: COLUMN_WIDTHS.lastName,
  },
  {
    id: "firstName",
    accessorKey: "user.firstName",
    header: "First Name",
    size: COLUMN_WIDTHS.firstName,
  },
  {
    id: "phone",
    accessorKey: "user.phone",
    header: "Phone",
    size: COLUMN_WIDTHS.phone,
  },
  {
    id: "email",
    accessorKey: "user.email",
    header: "Email",
    size: COLUMN_WIDTHS.email,
  },
  {
    id: "address",
    accessorKey: "report.address",
    header: "Address",
    size: COLUMN_WIDTHS.address,
  },
  {
    id: "receiveUpdates",
    accessorKey: "report.receiveUpdates",
    header: "User updates",
    size: COLUMN_WIDTHS.receiveUpdates,
    cell: ({ row }) => {
      const receiveUpdates = row.original.report.receiveUpdates;
      return <div>{receiveUpdates ? "Yes" : "No"}</div>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "report.createdAt",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    size: COLUMN_WIDTHS.createdAt,
    cell: ({ row }) => {
      const createdAt = row.original.report.createdAt;
      return (
        <div>{createdAt ? format(createdAt, "dd.MM.yyyy HH:mm:ss") : "—"}</div>
      );
    },
  },
  {
    id: "updatedAt",
    accessorKey: "report.updatedAt",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    size: COLUMN_WIDTHS.updatedAt,
    cell: ({ row }) => {
      const updatedAt = row.original.report.updatedAt;
      return (
        <div>{updatedAt ? format(updatedAt, "dd.MM.yyyy HH:mm:ss") : "—"}</div>
      );
    },
  },
];
