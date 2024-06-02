"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "../_components/data-table-view-options"

import { jenises, jenisKK, jenisesIKU } from "../_data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 space-y-2 flex-wrap">
        <Input
          placeholder="Filter dukumen/kriteria..."
          value={(table.getColumn("variabel")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("variabel")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("jenisIsian") && (
          <DataTableFacetedFilter
            column={table.getColumn("jenisIsian")}
            title="Jenis isian variabel"
            options={jenises}
          />
        )}
        {table.getColumn("isIndikatorKinerja") && (
          <DataTableFacetedFilter
            column={table.getColumn("isIndikatorKinerja")}
            title="Jenis kertas kerja"
            options={jenisKK}
          />
        )}
        {table.getColumn("jenisIsianIKU") && (
          <DataTableFacetedFilter
            column={table.getColumn("jenisIsianIKU")}
            title="Jenis isian IKU"
            options={jenisesIKU}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
