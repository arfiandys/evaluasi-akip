"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Checkbox } from "@/components/ui/checkbox"

import { SasaranIKU } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<SasaranIKU>[] = [
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
    accessorKey: "kode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("kode")}
          </span>
        </div>
      )
    },
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
    accessorKey: "indikatorIKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Indikator IKU" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.original.indikatorIKU.length}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
