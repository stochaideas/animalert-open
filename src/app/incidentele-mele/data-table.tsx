"use client";
import { useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { columns, type Report } from "./columns";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "~/components/ui/simple/table";
import { Button } from "~/components/ui/simple/button";
import { Input } from "~/components/ui/simple/input";

type Props = {
  data: Report[];
};

import type { Row } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/simple/select";

function fuzzyGlobalFilter(
  row: Row<Report>,
  columnId: string,
  filterValue: string,
) {
  // Loop through all visible cells of the row
  return row.getVisibleCells().some((cell) => {
    const cellValue = cell.getValue();
    // Convert to string safely
    return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
  });
}

export function DataTable({ data }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25, // Set your desired default, e.g., 25
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: fuzzyGlobalFilter, // or see below for custom
  });

  return (
    <>
      <div className="mt-4 mb-4 flex flex-col items-center justify-between md:flex-row">
        <div className="flex flex-row gap-4">
          <Input
            placeholder="Caută..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />

          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            defaultValue={String(table.getState().pagination.pageSize)}
          >
            <SelectTrigger className="text-body hover:cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral">
              {[10, 25, 50, 100].map((size) => (
                <SelectItem
                  className="hover:bg-neutral-hover text-body hover:cursor-pointer"
                  value={String(size)}
                  key={size}
                >
                  {size} / pagină
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex flex-1 items-center justify-end sm:flex-none">
          <Button
            className="mt-4"
            variant="tertiary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            &lt; Înapoi
          </Button>
          <Button
            className="mt-4 ml-4"
            variant="tertiary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            &gt; Înainte
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4">Total: {table.getRowModel().rows.length}</p>
    </>
  );
}
