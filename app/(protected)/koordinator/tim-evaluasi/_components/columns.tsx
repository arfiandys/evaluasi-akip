"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, kodeWilayahs, statuses } from "../_data/data"
import { timEvaluasi } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<timEvaluasi>[] = [
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
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    accessorFn: row => {
      const status =
        (
          row.name &&
          row.users.some((user) => user.assignedRole === UserRole.DALNIS) &&
          row.users.some((user) => user.assignedRole === UserRole.KETUA) &&
          row.users.some((user) => user.assignedRole === UserRole.ANGGOTA)
        ) ? "complete" : "incomplete";
      return (
        `${status}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const label_status =
        (
          row.original.name &&
          row.original.users.some((user) => user.assignedRole === UserRole.DALNIS) &&
          row.original.users.some((user) => user.assignedRole === UserRole.KETUA) &&
          row.original.users.some((user) => user.assignedRole === UserRole.ANGGOTA)
        ) ? "complete" : "incomplete";

      const status = statuses.find(
        (status) => status.value === label_status
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anggota" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.original.users.length}</div>,
  },
  {
    id: "unitKerja",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Kerja" />
    ),
    cell: ({ row }) => {
      let unitKerja = 0;
      row.original.users.forEach((user)=>{
        if (user.assignedRole === UserRole.ANGGOTA) {
          unitKerja = unitKerja + user.user.unitKerjas.length
        }
        
      })
      return (
        <div className="w-[120px]">{unitKerja}</div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
