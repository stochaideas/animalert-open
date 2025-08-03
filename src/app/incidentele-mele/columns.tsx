import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { format } from "date-fns";

export type Report = {
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

export const columns: ColumnDef<Report>[] = [
  {
    id: "report.reportNumber",
    accessorKey: "report.reportNumber",
    header: "Număr raport",
    size: COLUMN_WIDTHS.reportNumber,
    cell: ({ row }) => {
      return (
        <Link
          className="text-blue-700 hover:underline"
          href={`/incidentele-mele/${row.original.report.id}`}
        >
          {row.original.report.reportNumber}
        </Link>
      );
    },
  },
  {
    id: "report.reportType",
    accessorKey: "report.reportType",
    header: "Tip",
    size: COLUMN_WIDTHS.reportType,
    cell: ({ row }) => {
      return (
        <div>
          {{
            INCIDENT: "Incident",
            PRESENCE: "Prezență",
            CONFLICT: "Conflict/interacțiune",
          }[row.original.report.reportType] ?? "Necunoscut"}
        </div>
      );
    },
  },
  {
    id: "report.address",
    accessorKey: "report.address",
    header: "Adresă",
    size: COLUMN_WIDTHS.address,
  },
  {
    id: "report.createdAt",
    accessorKey: "report.createdAt",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data creării
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
    id: "report.updatedAt",
    accessorKey: "report.updatedAt",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer items-center select-none"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data actualizării
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
