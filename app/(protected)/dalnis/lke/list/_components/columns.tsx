"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, tahuns } from "../_data/data"
import { LKEUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableRowInput } from "./data-table-row-input"

export const columns: ColumnDef<LKEUnitKerja>[] = [
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
    accessorKey: "variabelLKE",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelLKE) {
        return (
          <div className="w-[120px]">{row.original.variabelLKE.kode}</div>
        )
      }
    },
  },
  {
    accessorKey: "tahun",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {
      const tahun = tahuns.find(
        (tahun) => tahun.value === row.original.tahun
      )

      if (!tahun) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{tahun.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
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

      if (row.original.variabelLKE) {
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
  {
    id: "isianDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Pengendali Teknis" />
    ),
    cell: ({ row }) => <DataTableRowInput role="dalnis" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "nilaiDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai Pengendali Teknis" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="w-[120px]">{row.getValue("nilaiDalnis")}</div>
        )
      }
    },
  },
  {
    accessorKey: "catataDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catatan Pengendali Teknis" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="w-[120px]">{row.getValue("catatanDalnis")}</div>
        )
      }
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
