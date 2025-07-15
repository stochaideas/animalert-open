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

import { columns, type ReportWithUser } from "./columns";

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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/simple/dropdown-menu";

type Props = {
  data: ReportWithUser[];
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
  row: Row<ReportWithUser>,
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
      <div className="mt-4 flex flex-row items-center justify-between">
        <Input
          placeholder="Search all columns..."
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
          <SelectTrigger className="text-body w-[90px] hover:cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-neutral">
            {[10, 25, 50, 100].map((size) => (
              <SelectItem
                className="hover:bg-neutral-hover text-body hover:cursor-pointer"
                value={String(size)}
                key={size}
              >
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          <Button
            className="mt-4"
            variant="tertiary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="ml-4"
            variant="tertiary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="mt-4" variant="tertiary">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="hover:bg-neutral-hover text-body bg-white hover:cursor-pointer"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  <span className="ml-4">
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
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
    </>
  );
}
