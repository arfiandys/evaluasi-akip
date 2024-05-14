"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, tahuns } from "../_data/data"
import { VariabelLKE } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<VariabelLKE>[] = [
  {
    accessorKey: "kode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode"/>
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "name",
    accessorFn: row => {
      const name = row.subKriteriaLKE?.name || row.kriteriaLKE?.name || row.subKomponenLKE?.name || row.komponenLKE?.name || ""
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      if (row.original.komponenLKEId) {
        return (
          <div className="max-w-[500px] truncate font-medium text-wrap">{row.original.komponenLKE?.name}</div>
        )
      }
      if (row.original.subKomponenLKEId) {
        return (
          <div className="max-w-[500px] truncate font-medium text-wrap">{row.original.subKomponenLKE?.name}</div>
        )
      }
      if (row.original.kriteriaLKEId) {
        return (
          <div className="max-w-[500px] truncate font-medium text-wrap">{row.original.kriteriaLKE?.name}</div>
        )
      }
      if (row.original.subKriteriaLKEId) {
        return (
          <div className="max-w-[500px] truncate font-medium text-wrap">{row.original.subKriteriaLKE?.name}</div>
        )
      }
    },
  },
  {
    accessorKey: "jenisIsian",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Isian" />
    ),
    cell: ({ row }) => {
      const jenis = jenises.find(
        (jenis) => jenis.value === row.original.jenisIsian
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
]
