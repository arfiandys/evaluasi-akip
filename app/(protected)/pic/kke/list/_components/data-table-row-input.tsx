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
import { LKEUnitKerjaSchema } from "../_data/schema"
import Link from "next/link"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { NumberForm } from "./number-form"
import { DropdownForm } from "./dropdown-form"
import { SelectForm } from "./select-form"

interface DataTableRowInputProps<TData> {
  row: Row<TData>
}

export function DataTableRowInput<TData>({
  row,
}: DataTableRowInputProps<TData>) {
  const LKEUnitKerja = LKEUnitKerjaSchema.parse(row.original)

  if (LKEUnitKerja.jenisIsian === "dropdown") {
    return (
      <DropdownForm initialData={LKEUnitKerja}/>
    )
  }

  if (LKEUnitKerja.jenisIsian === "select") {
    return (
      <SelectForm initialData={LKEUnitKerja}/>
    )
  }

  if (LKEUnitKerja.jenisIsian === "number") {
    return (
      <NumberForm initialData={LKEUnitKerja}/>
    )
  }

}
