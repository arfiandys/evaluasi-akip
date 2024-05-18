"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, jenisKK, jenisesIKU, tahuns } from "../_data/data"
import { VariabelKKE } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<VariabelKKE>[] = [
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "variabel",
    accessorFn: row => {
      const name = row.kriteriaKKE?.nama
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dokumen/Kriteria" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium text-wrap">
            {row.original.kriteriaKKE?.nama}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "jenisIsian",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis isian variabel" />
    ),
    cell: ({ row }) => {
      const jenis = jenises.find(
        (jenis) => jenis.value === row.original.jenisIsian
      )

      if (!jenis) {
        return null
      }

      return (
        <div className="w-auto truncate font-medium">
          <span>{jenis.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "isIndikatorKinerja",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis kertas kerja" />
    ),
    cell: ({ row }) => {
      const jenis = jenisKK.find(
        (jenis) => jenis.value === row.original.isIndikatorKinerja
      )

      if (!jenis) {
        return null
      }

      return (
        <div className="w-auto truncate font-medium">
          <span>{jenis.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "jenisIsianIKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis isian IKU" />
    ),
    cell: ({ row }) => {
      const jenis = jenisesIKU.find(
        (jenis) => jenis.value === row.original.jenisIsianIKU
      )

      if (!jenis) {
        return null
      }

      return (
        <div className="w-auto truncate font-medium">
          <span>{jenis.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
