"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import * as z from "zod";
import axios from "axios";

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

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { jenises } from "../_data/data"
import { LHESchema } from "../_data/schema"
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { File, Loader2, Upload, X } from "lucide-react";
import { FileUpload } from "@/components/file-upload";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

const formSchema = z.object({
  url: z.string().min(1),
  nameDokumen: z.string(),
});

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const LHE = LHESchema.parse(row.original)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const value = {
      ...values,
      unitKerjaId: LHE.unitKerjaId,
      action: "update"
    }
    try {
      await axios.patch(`/api/evaluasi/${LHE.evaluasiId}/lhe`, value);
      toast.success("LHE updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (id: string) => {
    const value = {
      unitKerjaId: id,
      action: "delete"
    }
    try {
      setDeletingId(id);
      await axios.patch(`/api/evaluasi/${LHE.evaluasiId}/lhe`, value);
      toast.success("Document deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Upload className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Apakah anda benar-benar yakin?</DrawerTitle>
            <DrawerDescription>Tindakan ini tidak bisa dibatalkan.</DrawerDescription>
          </DrawerHeader>
          <div className="my-5">
            <div>
              <FileUpload
                endpoint="permindokDokumen"
                onChange={(url, name) => {
                  if (url && name) {
                    onSubmit({ url: url, nameDokumen: name });
                  }
                }}
              />
              <div className="text-xs text-muted-foregroun mt-4">
                Tambah dokumen!
              </div>
            </div>
            <>
              {!LHE.url && (
                <p className="text-sm mt-2 text-slate-500 italic">
                  Belum ada dokumen
                </p>
              )}
              {LHE.url && (
                <div
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {LHE.nameDokumen}
                  </p>
                  {deletingId === LHE.unitKerjaId && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== LHE.unitKerjaId && (
                    <button
                      onClick={() => onDelete(LHE.unitKerjaId)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </>
          </div>
        </div>
      </DrawerContent>
    </Drawer>

  )
}
