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
import { kriteriaSchema } from "../_data/schema"
import Link from "next/link"
import { useParams } from "next/navigation"
import axios from "axios"
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ConfirmModal } from "@/components/modals/confirm-modal"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const kriteria = kriteriaSchema.parse(row.original);
  const params = useParams<{ komponenId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/lke/komponen/${params.komponenId}/subKomponen/${kriteria.subKomponenLKEId}/kriteria/${kriteria.id}`);

      toast.success("Kriteria berhasil dihapus");
      router.refresh();
      router.push(`/koordinator/evaluasi/${kriteria.variabelLKE?.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${kriteria.subKomponenLKEId}`);
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setIsLoading(false);
    }
  }
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
        <Link href={`/koordinator/evaluasi/${kriteria.variabelLKE?.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${kriteria.subKomponenLKEId}/kriteria/${kriteria.id}`}>
          <DropdownMenuItem asChild>
            <Button className="w-full justify-start cursor-pointer" size="sm" variant="ghost">
              Lihat
            </Button>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href={`/koordinator/evaluasi/${kriteria.variabelLKE?.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${kriteria.subKomponenLKEId}/kriteria/${kriteria.id}/edit`}>
          <DropdownMenuItem asChild>
            <Button className="w-full justify-start cursor-pointer" size="sm" variant="ghost">
              Edit
            </Button>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <ConfirmModal onConfirm={onDelete}>
            <Button disabled={isLoading} className="w-full justify-start px-2 py-[6px]" size="sm" variant="destructive">
              Hapus
            </Button>
          </ConfirmModal>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
