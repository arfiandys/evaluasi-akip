"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { roles } from "../_data/data"
import { User } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<User>[] = [
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
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px]">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px]">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = roles.find(
        (role) => role.value === row.original.role
      )

      if (!role) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {role.icon && (
            <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{role.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   id: "status",
  //   accessorFn: row => {
  //     const status =
  //       (
  //         row.kodeUnitKerja &&
  //         row.kodeWilayah &&
  //         row.name &&
  //         row.users.some((user) => user.assignedRole === UserRole.PIMPINAN) &&
  //         row.users.some((user) => user.assignedRole === UserRole.PIC)
  //       ) ? "complete" : "incomplete";
  //     return (
  //       `${status}`
  //     )
  //   },
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status_value =
  //       (
  //         row.original.kodeUnitKerja &&
  //         row.original.kodeWilayah &&
  //         row.original.name &&
  //         row.original.users.some((user) => user.assignedRole === UserRole.PIMPINAN) &&
  //         row.original.users.some((user) => user.assignedRole === UserRole.PIC)
  //       ) ? "complete" : "incomplete";

  //     const status = statuses.find(
  //       (status) => status.value === status_value
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    accessorKey: "unitKerjas",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit kerja" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.original.unitKerjas.length}</div>,
  },
  {
    accessorKey: "timEvaluasis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tim Evaluasi" />
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.original.timEvaluasis.length}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
