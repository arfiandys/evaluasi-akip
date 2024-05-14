"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { jenises, tahuns } from "../_data/data"
import { permindokUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"

export const columns: ColumnDef<permindokUnitKerja>[] = [
  {
    id: "kode",
    accessorFn: row => {
      const kode = row.permindok.kode
      return (
        `${kode}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode" />
    ),
    cell: ({ row }) => {
      if (row.original.permindok) {
        return (
          <div className="w-[120px]">{row.original.permindok.kode}</div>
        )
      }
    },
  },
  {
    id: "tahun",
    accessorFn: row => {
      const tahun = row.permindok.tahun
      return (
        `${tahun}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => {
      if (row.original.permindok) {
        return (
          <div className="w-[120px]">{row.original.permindok.tahun}</div>
        )
      }
    },
  },
  {
    id: "name",
    accessorFn: row => {
      const name = row.permindok.name
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {

      if (row.original.permindok) {
        return (
          <div className="w-[120px]">{row.original.permindok.name}</div>
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
      <DataTableColumnHeader column={column} title="Unit kerja" />
    ),
    cell: ({ row }) => {

      if (row.original.permindok) {
        return (
          <div className="w-[120px]">{row.original.unitKerja.name}</div>
        )
      }
    },
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {

      if (row.original.url) {
        return (
          <Link href={row.original.url} legacyBehavior>
            <a target="_blank">
              <Button>
                <File className="h-4 w-4 mr-2" />
                <p className="truncate max-w-48">{row.original.nameDokumen}</p>
              </Button>
            </a>
          </Link>
        )
      }
    },
  },
]
