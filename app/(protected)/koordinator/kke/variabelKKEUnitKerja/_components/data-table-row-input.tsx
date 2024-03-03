"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { jenises } from "../_data/data"
import { VariabelKKEUnitKerjaSchema } from "../_data/schema"
import Link from "next/link"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { NumberForm } from "./number-form"
import { SelectForm } from "./select-form"
import { DropdownForm } from "./dropdown-form"

interface DataTableRowInputProps<TData> {
  row: Row<TData>
}

export function DataTableRowInput<TData>({
  row,
}: DataTableRowInputProps<TData>) {
  const VariabelKKEUnitKerja = VariabelKKEUnitKerjaSchema.parse(row.original)

  if (VariabelKKEUnitKerja.jenisIsian === "dropdown") {
    return (
      <DropdownForm initialData={VariabelKKEUnitKerja}/>
    )
  }

  if (VariabelKKEUnitKerja.jenisIsian === "select") {
    return (
      <SelectForm initialData={VariabelKKEUnitKerja}/>
    )
  }

  if (VariabelKKEUnitKerja.jenisIsian === "number") {
    return (
      <NumberForm initialData={VariabelKKEUnitKerja}/>
    )
  }

}
