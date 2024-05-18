"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, kodeWilayahs, statuses } from "../_data/data"
import { Kriteria } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<Kriteria>[] = [
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
          <span className="w-auto truncate font-medium">
            {row.getValue("kode")}
          </span>
        </div>
      )
    },
  }, 
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
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
    accessorKey: "bobot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bobot" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="w-auto truncate font-medium">
            {row.getValue("bobot")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "subKriteriaLKE",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kriteria LKE" />
    ),
    cell: ({ row }) => <div className="w-auto">{row.original.subKriteriaLKE.length}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
