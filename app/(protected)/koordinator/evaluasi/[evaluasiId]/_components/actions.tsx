"use client";
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ActionsProps {
  disabled: boolean;
  evaluasiId: string;
  status: string;
};

export const Actions = ({
  disabled,
  evaluasiId,
  status,
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const [statuse, setStatuse] = useState<string>(status);

  const onSubmit = (value: string) => {
    setStatuse(value)
    console.log(value)
  }

  const onClick = async () => {
    console.log(statuse)
    if (disabled) {
      toast.error("Lengkapi terlebih dahulu semua isian!");
    } else {

      try {
        setIsLoading(true);

        if ((statuse === "publish") && (status !== statuse)) {
          await axios.patch(`/api/evaluasi/${evaluasiId}/publish`);
          toast.success("Evaluasi dalam tahap pengerjaan");
          confetti.onOpen();
        } else if ((statuse === "draft") && (status !== statuse)) {
          await axios.patch(`/api/evaluasi/${evaluasiId}/unpublish`);
          toast.success("Evaluasi dalam rancangan");
        } else if ((statuse === "finish") && (status !== statuse)) {
          await axios.patch(`/api/evaluasi/${evaluasiId}/finish`);
          toast.success("Evaluasi sudah selesai");
        } else if ((statuse === "check") && (status !== statuse)) {
          await axios.patch(`/api/evaluasi/${evaluasiId}/check`);
          toast.success("Evaluasi dalam tahap pengecekan");
        }
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan!");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/evaluasi/${evaluasiId}`);

      toast.success("Evaluasi berhasil dihapus");
      router.refresh();
      router.push(`/koordinator/evaluasi`);
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {status === "finish" ? "Selesai" : (status === "publish" ? "Tahap pengerjaan" : (status === "check" ? "Tahap pengecekan" : "Rancangan"))}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Select onValueChange={(value) => { onSubmit(value) }} defaultValue={status}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih aksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publish">Tahap pengerjaan</SelectItem>
              <SelectItem value="draft">Rancangan</SelectItem>
              <SelectItem value="check">Tahap pengecekan</SelectItem>
              <SelectItem value="finish">Selesai</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4 w-full">
            <ConfirmModal onConfirm={onClick}>
              <Button className="w-full" disabled={isLoading}>Simpan</Button>
            </ConfirmModal>
          </div>
        </PopoverContent>
      </Popover>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}