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
import { variabelKKESchema } from "../_data/schema"
import Link from "next/link"
import { Eye } from "lucide-react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const variabelKKE = variabelKKESchema.parse(row.original)

  return (
    <Link href={`/koordinator/evaluasi/${variabelKKE.evaluasiId}/kke/variabel/${variabelKKE.id}`}>
      <Button variant="ghost" className="gap-x-2 p-2">
      <Eye className="h-4 w-4" />
        <span>Lihat</span>
      </Button>
    </Link>
  )
}
