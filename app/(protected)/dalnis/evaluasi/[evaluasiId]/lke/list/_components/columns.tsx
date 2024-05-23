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
import { DataTableRowCatatan } from "./data-table-row-catatan"

export const columns: ColumnDef<LKEUnitKerja>[] = [
  {
    id: "kodeVariabel",
    accessorFn: row => {
      const kode = row.variabelLKE.kode;
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.original.variabelLKE.kode}
            </span>
          </div>
        )
      }
    },
  },
  {
    id: "namaVariabel",
    accessorFn: row => {
      const nama = row.variabelLKE.komponenLKE?.name || row.variabelLKE.subKomponenLKE?.name || row.variabelLKE.kriteriaLKE?.name || row.variabelLKE.subKriteriaLKE?.name;
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kriteria" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] text-wrap truncate font-medium">
              {row.original.variabelLKE.komponenLKE?.name || row.original.variabelLKE.subKomponenLKE?.name || row.original.variabelLKE.kriteriaLKE?.name || row.original.variabelLKE.subKriteriaLKE?.name}
            </span>
          </div>
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

      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.original.unitKerja.name}
            </span>
          </div>
        )
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "isianKt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Ketua" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.getValue("isianKt")}
            </span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: "catatanKt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catatan Ketua" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.getValue("catatanKt")}
            </span>
          </div>
        )
      }
    },
  },
  {
    id: "isianDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Dalnis" />
    ),
    cell: ({ row }) =>
      <div className="">
        <DataTableRowInput role="dalnis" row={row} />
      </div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "nilaiDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai Dalnis" />
    ),
    cell: ({ row }) => {

      if (row.original.variabelLKE) {
        return (
          <div className="flex space-x-2">
            <span className="w-auto text-wrap truncate font-medium">
              {row.getValue("nilaiDalnis")}
            </span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: "catatanDalnis",
    header: ({ column }) => (
      <div className="min-w-[200px]">
        <DataTableColumnHeader column={column} title="Catatan Dalnis" />
      </div>
    ),
    cell: ({ row }) => <DataTableRowCatatan role="dalnis" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
]
