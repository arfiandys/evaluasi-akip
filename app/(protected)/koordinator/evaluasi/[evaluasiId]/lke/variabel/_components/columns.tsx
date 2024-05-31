"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, jeniseVar, tahuns } from "../_data/data"
import { VariabelLKE } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { UserRole } from "@prisma/client"

export const columns: ColumnDef<VariabelLKE>[] = [
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
    id: "jenisVariabel",
    accessorFn: row => {
      const name = row.levelVariabel
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Variabel" />
    ),
    cell: ({ row }) => {
      const jenis = jeniseVar.find(
        (jenis) => jenis.value === row.original.levelVariabel
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
    id: "kriteria",
    accessorFn: row => {
      const name = row.subKriteriaLKE?.name || row.kriteriaLKE?.name || row.subKomponenLKE?.name || row.komponenLKE?.name || ""
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kriteria" />
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
    id: "bobot",
    accessorFn: row => {
      const bobot = (row.levelVariabel === "komponen" ? (row.komponenLKE?.bobot) : (row.levelVariabel === "subKomponen" ? (row.subKomponenLKE?.bobot) : (row.levelVariabel === "kriteria" ? (row.kriteriaLKE?.bobot) : (row.levelVariabel === "subKriteria" ? (row.subKriteriaLKE?.bobot) : ("")))))
      return (
        `${bobot}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bobot" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="w-auto truncate font-medium">
            {row.getValue("bobot")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "isPembobot",
    accessorFn: row => {
      const isPembobot = (row.isPembobot ? "Ya":"Tidak")
      return (
        `${isPembobot}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pembobot" />
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="w-auto truncate font-medium">
            {row.getValue("isPembobot")}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
]
