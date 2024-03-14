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
    id: "variabelKKE",
    accessorFn: row => {
      const variabelKKE = row.variabelKKE.nama
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
          <div className="max-w-[400px]">{row.original.variabelKKE.nama}</div>
        )
      }
    },
  },
  {
    id: "tahun",
    accessorFn: row => {
      const tahun = row.tahun
      return (
        `${tahun}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {
      const tahun = tahuns.find(
        (tahun) => Number(tahun.value) === row.original.tahun
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
      const name_permindok = row.original.unitKerja.permindoks.find(function (permindok) {
        return permindok.permindokId === row.original.variabelKKE.kriteriaKKE?.kelompokKriteriaKKE.permindokId;
      })?.nameDokumen;

      if (permindok) {
        return (
          <Link href={permindok} legacyBehavior>
            <a target="_blank">
              <Button>
                <File className="h-4 w-4 mr-2" />
                <p className="truncate max-w-48">{name_permindok}</p>
              </Button>
            </a>
          </Link>
        )
      } else {
        return(
        <Button>
          <File className="h-4 w-4 mr-2" />
          <p className="truncate max-w-48">?</p>
        </Button>
      )}
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
