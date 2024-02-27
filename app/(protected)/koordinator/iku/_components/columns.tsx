"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { IKU } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<IKU>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }, 
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] text-wrap truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tahun",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("tahun")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tujuanIKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tujuan IKU" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.original.tujuanIKU.length}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
