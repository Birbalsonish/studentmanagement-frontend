"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

interface GenericTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  searchKeys?: (keyof T)[];
}

export function GenericTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  searchKeys = [],
}: GenericTableProps<T>) {
  const [filter, setFilter] = useState("");

  // Add actions column if edit/delete provided
  const finalColumns = useMemo(() => {
    const actionCol: ColumnDef<T>[] =
      onEdit || onDelete
        ? [
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                  {onEdit && (
                    <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ),
            },
          ]
        : [];
    return [...columns, ...actionCol];
  }, [columns, onEdit, onDelete]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { globalFilter: filter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      if (!searchKeys.length) return true;
      return searchKeys.some((key) =>
        String(row.original[key]).toLowerCase().includes(String(filterValue).toLowerCase())
      );
    },
  });

  return (
    <div className="space-y-4">
      {searchKeys.length > 0 && (
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      )}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
    </div>
  );
}

