"use client"

import { ColumnDef } from "@tanstack/react-table"

import { VariabelKKEUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<VariabelKKEUnitKerja>[] = [
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
      const kode = row.variabelKKE.kriteriaKKE?.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="w-auto">{row.original.variabelKKE.kriteriaKKE?.kode}</div>
        )
      }
    },
  },
  {
    id: "variabel",
    accessorFn: row => {
      const variabelKKE = row.variabelKKE.kriteriaKKE?.nama
      return (
        `${variabelKKE}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dokumen/Kriteria" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="max-w-[500px]">{row.original.variabelKKE.kriteriaKKE?.nama}</div>
        )
      }
    },
  },
  {
    id: "jenisKertasKerja",
    accessorFn: row => {
      const variabelKKE = row.variabelKKE.isIndikatorKinerja?"KK Indikator Kinerja":"KK Evaluasi Dokumen"
      return (
        `${variabelKKE}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis kertas kerja" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-auto items-center">
          <span>{row.getValue("jenisKertasKerja")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "isianAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Anggota" />
    ),
    cell: ({ row }) => {
      if (row.original.isianAt) {
        return (
          <div className="w-auto">{row.original.isianAt}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "isianKt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Ketua" />
    ),
    cell: ({ row }) => {
      if (row.original.isianKt) {
        return (
          <div className="w-auto">{row.original.isianKt}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "isianDalnis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Pengendali Teknis" />
    ),
    cell: ({ row }) => {
      if (row.original.isianDalnis) {
        return (
          <div className="w-auto">{row.original.isianDalnis}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "isianPIC",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian PIC" />
    ),
    cell: ({ row }) => {
      if (row.original.isianPIC) {
        return (
          <div className="w-auto">{row.original.isianPIC}</div>
        )
      }
    },
    enableSorting: false,
    enableHiding: true,
  },
]
