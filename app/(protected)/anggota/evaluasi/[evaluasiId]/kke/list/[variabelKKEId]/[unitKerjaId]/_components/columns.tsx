"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, tahuns } from "../_data/data"
import { VariabelIKUUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
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
          <div className="max-w-[100px]">{row.original.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.kode}</div>
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
          <div className="max-w-[700px]">{row.original.tujuanSasaranIndikatorIKUVariabelKKE.tujuanSasaranIndikatorIKU?.nama}</div>
        )
      }
    },
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
