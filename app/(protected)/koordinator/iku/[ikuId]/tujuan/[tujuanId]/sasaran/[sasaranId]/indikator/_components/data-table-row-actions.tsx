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
import { indikatorIKUSchema } from "../_data/schema"
import Link from "next/link"
import { useParams } from "next/navigation"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const indikatorIKU = indikatorIKUSchema.parse(row.original)
  const params = useParams<{ ikuId: string, tujuanId: string, sasaranId: string }>()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/koordinator/iku/${params.ikuId}/tujuan/${params.tujuanId}/sasaran/${params.sasaranId}/indikator/${indikatorIKU.id}`}>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Name</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={indikatorIKU.name}>
              {jenises.map((jenis) => (
                <DropdownMenuRadioItem key={jenis.value} value={jenis.value}>
                  {jenis.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
