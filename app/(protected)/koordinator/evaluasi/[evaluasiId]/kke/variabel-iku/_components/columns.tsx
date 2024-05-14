"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { tahuns } from "../_data/data"
import { VariabelIKU } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<VariabelIKU>[] = [
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
    accessorKey: "jenisIKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama IKU" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium text-wrap">
            {row.getValue("jenisIKU")}
          </span>
        </div>
      )
    },
  },
  {
    id: "kodeVariabelKKE",
    accessorFn: row => {
      const kode = row.variabelKKE?.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode variabel KKE" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.variabelKKE?.kode}
          </span>
        </div>
      )
    },
  },
  {
    id: "variabelKKE",
    accessorFn: row => {
      const nama = row.variabelKKE?.kriteriaKKE?.nama
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variabel KKE" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium text-wrap">
            {row.original.variabelKKE?.kriteriaKKE?.nama}
          </span>
        </div>
      )
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
          <span className="max-w-[500px] truncate font-medium">
            {row.original.tujuanSasaranIndikatorIKU?.kode}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "tujuanSasaranIndikatorIKU",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tujuan/Sasaran/Indikator IKU" />
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
  {
    id: "tahun",
    accessorFn: row => {
      const tahun = row.variabelKKE?.tahun.toString()
      return (
        `${tahun}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {
      const tahun = tahuns.find(
        (tahun) => tahun.value === row.original.variabelKKE?.tahun.toString()
      )

      if (!tahun) {
        return null
      }

      return (
        <div className="max-w-[500px] truncate font-medium">
          <span>{tahun.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
