"use client"

import { ColumnDef } from "@tanstack/react-table"

import {  } from "../_data/data"
import { permindokUnitKerja } from "../_data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { File } from "lucide-react"

export const columns: ColumnDef<permindokUnitKerja>[] = [
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

      if (row.original.permindok) {
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
          <div className="w-auto">{row.original.permindok.kode}</div>
        )
      }
    },
  },
  {
    id: "permindok",
    accessorFn: row => {
      const name = row.permindok.name
      return (
        `${name}`
      )
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permindok" />
    ),
    cell: ({ row }) => {

      if (row.original.permindok) {
        return (
          <div className="max-w-[500px]">{row.original.permindok.name}</div>
        )
      }
    },
  },
  {
    accessorKey: "file",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File" />
    ),
    cell: ({ row }) => {

      if (row.original.url) {
        return (
          <Link href={row.original.url} legacyBehavior>
            <a target="_blank">
              <Button>
                <File className="h-4 w-4" />
              </Button>
            </a>
          </Link>
        )
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
