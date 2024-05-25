"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { toast } from "sonner";

interface ActionsProps {
  disabled: boolean;
  IKUId: string;
  evaluasiId: string;
};

export const Actions = ({
  disabled,
  IKUId,
  evaluasiId
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/iku/${IKUId}`);

      toast.success("IKU berhasil dihapus");
      router.refresh();
      router.push(`/koordinator/evaluasi/${evaluasiId}/iku`);
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}