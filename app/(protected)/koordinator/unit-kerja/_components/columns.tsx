"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, statuses } from "../_data/data"
import { unitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"
import { GlobeIcon } from "lucide-react"

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
          <span className="w-auto">
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

      return (
        <div className="flex w-auto items-center">
          <GlobeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.original.kodeWilayah}</span>
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
        <div className="flex w-auto items-center">
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

      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-auto items-center">
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
    id: "anggota",
    accessorFn: row => {
      const anggota = row.users.filter((item) => (item.assignedRole === UserRole.PIMPINAN) || (item.assignedRole === UserRole.PIC));
      return (
        `${anggota.length}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Anggota" />
    ),
    cell: ({ row }) => <div className="w-auto">{row.getValue("anggota")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
