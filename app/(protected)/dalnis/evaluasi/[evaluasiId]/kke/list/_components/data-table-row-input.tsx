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
  row: Row<TData>;
  role: string;
}

export function DataTableRowInput<TData>({
  row,role
}: DataTableRowInputProps<TData>) {
  const VariabelKKEUnitKerja = VariabelKKEUnitKerjaSchema.parse(row.original)

  if (VariabelKKEUnitKerja.variabelKKE.jenisIsian === "dropdown") {
    return (
      <DropdownForm role={role} initialData={VariabelKKEUnitKerja}/>
    )
  }

  if (VariabelKKEUnitKerja.variabelKKE.jenisIsian === "select") {
    return (
      <SelectForm role={role} initialData={VariabelKKEUnitKerja}/>
    )
  }

  if (VariabelKKEUnitKerja.variabelKKE.jenisIsian === "number") {
    return (
      <NumberForm role={role} initialData={VariabelKKEUnitKerja}/>
    )
  }

}
