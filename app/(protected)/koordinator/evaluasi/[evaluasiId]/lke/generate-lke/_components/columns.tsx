"use client"

import { ColumnDef } from "@tanstack/react-table"

import { jenises } from "../_data/data"
import { LKEUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<LKEUnitKerja>[] = [
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
          <div className="w-auto">{row.original.unitKerja.name}</div>
        )
      }
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "kode",
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
      if (row.original.variabelLKE.kode) {
        return (
          <div className="w-auto">{row.original.variabelLKE.kode}</div>
        )
      }
    },
  },
  {
    id: "variabel",
    accessorFn: row => {
      const nama = row.variabelLKE.komponenLKE?.name||row.variabelLKE.subKomponenLKE?.name||row.variabelLKE.kriteriaLKE?.name||row.variabelLKE.subKriteriaLKE?.name;
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
          <div className="max-w-[500px]">{row.original.variabelLKE.komponenLKE?.name||row.original.variabelLKE.subKomponenLKE?.name||row.original.variabelLKE.kriteriaLKE?.name||row.original.variabelLKE.subKriteriaLKE?.name}</div>
        )
      }
    },
  },
  {
    accessorKey: "jenisIsian",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis isian" />
    ),
    cell: ({ row }) => {
      const jenis = jenises.find(
        (jenis) => jenis.value === row.original.variabelLKE?.jenisIsian
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
    accessorKey: "nilaiAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai Anggota" />
    ),
    cell: ({ row }) => {

      if (row.original.nilaiAt) {
        return (
          <div className="w-[120px]">{row.original.nilaiAt}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nilaiKt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai Ketua" />
    ),
    cell: ({ row }) => {

      if (row.original.nilaiKt) {
        return (
          <div className="w-[120px]">{row.original.nilaiKt}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nilaiDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nilai Dalnis" />
    ),
    cell: ({ row }) => {

      if (row.original.nilaiDalnis) {
        return (
          <div className="w-[120px]">{row.original.nilaiDalnis}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: false,
  },
]
