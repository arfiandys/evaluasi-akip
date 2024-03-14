"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, kodeWilayahs, statuses } from "../_data/data"
import { unitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<unitKerja>[] = [
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
      const label = jenises.find((jenis) => jenis.value === row.original.name)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
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
    accessorKey: "kodeUnitKerja",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Unit Kerja" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px]">
            {row.getValue("kodeUnitKerja")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "kodeWilayah",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Wilayah" />
    ),
    cell: ({ row }) => {
      const kodeWilayah = kodeWilayahs.find(
        (kodeWilayah) => kodeWilayah.value === row.original.kodeWilayah
      )

      if (!kodeWilayah) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {kodeWilayah.icon && (
            <kodeWilayah.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{kodeWilayah.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "jenisUnitKerja",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Unit Kerja" />
    ),
    cell: ({ row }) => {
      const jenis = jenises.find(
        (jenis) => jenis.value === row.original.jenisUnitKerja
      )

      if (!jenis) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{jenis.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "status",
    accessorFn: row => {
      const status =
        (
          row.kodeUnitKerja &&
          row.kodeWilayah &&
          row.name &&
          row.users.some((user) => user.assignedRole === UserRole.PIMPINAN) &&
          row.users.some((user) => user.assignedRole === UserRole.PIC)
        ) ? "complete" : "incomplete";
      return (
        `${status}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status_value =
        (
          row.original.kodeUnitKerja &&
          row.original.kodeWilayah &&
          row.original.name &&
          row.original.users.some((user) => user.assignedRole === UserRole.PIMPINAN) &&
          row.original.users.some((user) => user.assignedRole === UserRole.PIC)
        ) ? "complete" : "incomplete";

      const status = statuses.find(
        (status) => status.value === status_value
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
