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

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (status === "draft") {
        await axios.patch(`/api/evaluasi/${evaluasiId}/publish`);
        toast.success("Evaluasi published");
        confetti.onOpen();
      } else if (status === "publish") {
        await axios.patch(`/api/evaluasi/${evaluasiId}/unpublish`);
        toast.success("Evaluasi unpublished");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/evaluasi/${evaluasiId}`);

      toast.success("Evaluasi deleted");
      router.refresh();
      router.push(`/koordinator/evaluasi`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onClick}>
        <Button
          disabled={disabled || isLoading}
          variant="outline"
          size="sm"
        >
          {(status === "publish") ? "Unpublish" : "Publish"}
        </Button>
      </ConfirmModal>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}