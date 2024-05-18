"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "../_components/data-table-view-options"

import { tahuns } from "../_data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  uniqueData: {
    value: string;
    label: string;
  }[][]
}

export function DataTableToolbar<TData>({
  table, uniqueData
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const dataIKU = uniqueData[0]

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tujuan/sasaran/indikator..."
          value={(table.getColumn("TSI")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("TSI")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("IKU") && (
          <DataTableFacetedFilter
            column={table.getColumn("IKU")}
            title="IKU"
            options={dataIKU}
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
