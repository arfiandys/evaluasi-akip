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
import { VariabelIKUUnitKerjaSchema } from "../_data/schema"
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
  const VariabelIKUUnitKerja = VariabelIKUUnitKerjaSchema.parse(row.original)

  if (VariabelIKUUnitKerja.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.jenisIsianIKU === "dropdown") {
    return (
      <DropdownForm role={role} initialData={VariabelIKUUnitKerja}/>
    )
  }

  if (VariabelIKUUnitKerja.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.jenisIsianIKU === "select") {
    return (
      <SelectForm role={role} initialData={VariabelIKUUnitKerja}/>
    )
  }

  if (VariabelIKUUnitKerja.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.jenisIsianIKU === "number") {
    return (
      <NumberForm role={role} initialData={VariabelIKUUnitKerja}/>
    )
  }

}
