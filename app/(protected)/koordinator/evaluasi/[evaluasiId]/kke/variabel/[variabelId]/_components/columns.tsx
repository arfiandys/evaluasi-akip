"use client"

import { ColumnDef } from "@tanstack/react-table"
import { VariabelIKU } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"

export const columns: ColumnDef<VariabelIKU>[] = [
  {
    id: "IKU",
    accessorFn: row => {
      const nama = row.jenisIKU
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IKU" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="w-auto truncate font-medium">
            {row.original.jenisIKU}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "kodeTSI",
    accessorFn: row => {
      const kode = row.tujuanSasaranIndikatorIKU?.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Tujuan/Sasaran/Indikator" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="w-auto truncate font-medium">
            {row.original.tujuanSasaranIndikatorIKU?.kode}
          </span>
        </div>
      )
    },
  },
  {
    id: "TSI",
    accessorFn: row => {
      const nama = row.tujuanSasaranIndikatorIKU?.nama
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tujuan/Sasaran/Indikator" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium text-wrap">
            {row.original.tujuanSasaranIndikatorIKU?.nama}
          </span>
        </div>
      )
    },
  },
]
