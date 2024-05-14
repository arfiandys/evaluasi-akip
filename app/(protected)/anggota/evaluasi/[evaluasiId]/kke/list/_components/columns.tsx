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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"

export const columns: ColumnDef<VariabelKKEUnitKerja>[] = [
  {
    id: "kodeVariabel",
    accessorFn: row => {
      const kode = row.variabelKKE.kode
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
          <div className="max-w-[100px]">{row.original.variabelKKE.kode}</div>
        )
      }
    },
  },
  {
    id: "namaVariabel",
    accessorFn: row => {
      const nama = row.variabelKKE.kriteriaKKE?.nama
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dokumen/Kriteria" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="max-w-[700px]">{row.original.variabelKKE.kriteriaKKE?.nama}</div>
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
    id: "isianAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Anggota" />
    ),
    cell: ({ row }) => <DataTableRowInput role="at" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "permindok",
    accessorFn: row => {
      const permindok = row.unitKerja.permindoks
      return (
        `${permindok}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {
      const permindok = row.original.unitKerja.permindoks.find(function (permindok) {
        return permindok.permindokId === row.original.variabelKKE.kriteriaKKE?.kelompokKriteriaKKE.permindokId;
      })?.url;
      if (permindok) {
        return (
          <Link href={permindok} legacyBehavior>
            <a target="_blank">
              <Button>
                <File className="h-4 w-4 mr-2" />
              </Button>
            </a>
          </Link>
        )
      } else {
        return(<></>)}
    },
  },
]

  // Kolom Indikator Kinerja


export const columnsIndikatorKinerja: ColumnDef<VariabelKKEUnitKerja>[] = [
  {
    id: "kodeVariabel",
    accessorFn: row => {
      const kode = row.variabelKKE.kode
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
          <div className="max-w-[100px]">{row.original.variabelKKE.kode}</div>
        )
      }
    },
  },
  {
    id: "namaVariabel",
    accessorFn: row => {
      const nama = row.variabelKKE.kriteriaKKE?.nama
      return (
        `${nama}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dokumen/Kriteria" />
    ),
    cell: ({ row }) => {
      if (row.original.variabelKKE) {
        return (
          <div className="max-w-[700px]">{row.original.variabelKKE.kriteriaKKE?.nama}</div>
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
    id: "isianAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Isian Anggota" />
    ),
    cell: ({ row }) => <DataTableRowInput role="at" row={row} />,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "permindok",
    accessorFn: row => {
      const permindok = row.unitKerja.permindoks
      return (
        `${permindok}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {
      const permindok = row.original.unitKerja.permindoks.find(function (permindok) {
        return permindok.permindokId === row.original.variabelKKE.kriteriaKKE?.kelompokKriteriaKKE.permindokId;
      })?.url;
      if (permindok) {
        return (
          <Link href={permindok} legacyBehavior>
            <a target="_blank">
              <Button>
                <File className="h-4 w-4 mr-2" />
              </Button>
            </a>
          </Link>
        )
      } else {
        return(<></>)}
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]