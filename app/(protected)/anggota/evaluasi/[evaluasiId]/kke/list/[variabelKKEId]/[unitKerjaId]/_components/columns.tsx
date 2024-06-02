"use client"

import { ColumnDef } from "@tanstack/react-table"

import { VariabelIKUUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableRowInput } from "./data-table-row-input"

export const columns: ColumnDef<VariabelIKUUnitKerja>[] = [
  {
    id: "kode",
    accessorFn: row => {
      const kode = row.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {
      if (row.original.tujuanSasaranIndikatorIKUVariabelKKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.original.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.kode}
            </span>
          </div>
        )
      }
    },
  },
  {
    id: "tsi",
    accessorFn: row => {
      const tsi = row.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.nama
      return (
        `${tsi}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tujuan/Sasaran/Indikator" />
    ),
    cell: ({ row }) => {
      if (row.original.tujuanSasaranIndikatorIKUVariabelKKE) {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] text-wrap truncate font-medium">
              {row.original.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.nama}
            </span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: "isianPIC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian PIC" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="w-auto text-wrap truncate font-medium">
            {row.original.isianPIC}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "isianAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Anggota" />
    ),
    cell: ({ row }) => <DataTableRowInput role="at" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
]
