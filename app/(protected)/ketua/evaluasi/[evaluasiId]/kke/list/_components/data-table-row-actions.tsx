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
import { Eye } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const VariabelKKEUnitKerja = VariabelKKEUnitKerjaSchema.parse(row.original)

  return (
    <Link href={`/ketua/evaluasi/${VariabelKKEUnitKerja.variabelKKE.evaluasiId}/kke/list/${VariabelKKEUnitKerja.variabelKKEId}/${VariabelKKEUnitKerja.unitKerjaId}`}>
      <Button
        variant="ghost"
        className="flex gap-x-2 p-2 data-[state=open]:bg-muted"
      >
        <Eye className="h-4 w-4" />
        <span>Lihat IKU</span>
      </Button>

    </Link>

  )
}
