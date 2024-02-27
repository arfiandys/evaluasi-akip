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
  tujuanId: string;
  sasaranId: string;
  indikatorId: string;
};

export const Actions = ({
  disabled,
  IKUId,
  tujuanId,
  sasaranId,
  indikatorId
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/iku/${IKUId}/tujuan/${tujuanId}/sasaran/${sasaranId}/indikator/${indikatorId}`);

      toast.success("Indikator deleted");
      router.refresh();
      router.push(`/koordinator/iku/${IKUId}/tujuan/${tujuanId}//sasaran/${sasaranId}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}