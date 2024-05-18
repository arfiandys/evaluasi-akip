"use client"
import { Row } from "@tanstack/react-table"

import { LKEUnitKerjaSchema } from "../_data/schema"
import { NumberForm } from "./number-form"
import { SelectForm } from "./select-form"
import { DropdownForm } from "./dropdown-form"

interface DataTableRowInputProps<TData> {
  row: Row<TData>;
  role: string;
}

export function DataTableRowInput<TData>({
  row, role
}: DataTableRowInputProps<TData>) {
  const LKEUnitKerja = LKEUnitKerjaSchema.parse(row.original)

  if (LKEUnitKerja.variabelLKE.jenisIsian === "dropdown") {
    return (
      <DropdownForm role={role} initialData={LKEUnitKerja}/>
    )
  }

  if (LKEUnitKerja.variabelLKE.jenisIsian === "select") {
    return (
      <SelectForm role={role} initialData={LKEUnitKerja}/>
    )
  }

  if (LKEUnitKerja.variabelLKE.jenisIsian === "number") {
    return (
      <NumberForm role={role} initialData={LKEUnitKerja}/>
    )
  }

}
