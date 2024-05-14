"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, tahuns } from "../_data/data"
import { VariabelKKEUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableRowInput } from "./data-table-row-input"

export const columns: ColumnDef<VariabelKKEUnitKerja>[] = [
  {
    id: "kode",
    accessorFn: row => {
      const kode = row.variabelKKE.kriteriaKKE?.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variabel KKE" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="w-[120px]">{row.original.variabelKKE.kriteriaKKE?.kode}</div>
        )
      }
    },
  },
  {
    id: "variabelKKE",
    accessorFn: row => {
      const variabelKKE = row.variabelKKE.kriteriaKKE?.nama
      return (
        `${variabelKKE}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variabel KKE" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="w-[120px]">{row.original.variabelKKE.kriteriaKKE?.nama}</div>
        )
      }
    },
  },
  {
    id: "unitKerja",
    accessorFn: row => {
      const name = row.unitKerja.name
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Kerja" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelKKE) {
        return (
          <div className="w-[120px]">{row.original.unitKerja.name}</div>
        )
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "jenisIsian",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis isian" />
    ),
    cell: ({ row }) => {
      const jenis = jenises.find(
        (jenis) => jenis.value === row.original.variabelKKE.jenisIsian
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
    id: "isianPIC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian PIC" />
    ),
    cell: ({ row }) => <DataTableRowInput role="pic" row={row} />,
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
  {
    id: "isianKt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Ketua" />
    ),
    cell: ({ row }) => <DataTableRowInput role="kt" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "isianDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Pengendali Teknis" />
    ),
    cell: ({ row }) => <DataTableRowInput role="dalnis" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
]
