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
  subKriteriaId: string;
  kriteriaId: string;
  subKomponenId: string;
  komponenId: string;
};

export const Actions = ({
  disabled,
  subKriteriaId,
  kriteriaId,
  subKomponenId,
  komponenId
}: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  
  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/variabel-lke/komponen/${komponenId}/subKomponen/${subKomponenId}/kriteria/${kriteriaId}/subKriteria/${subKriteriaId}`);

      toast.success("Kriteria deleted");
      router.refresh();
      router.push(`/koordinator/variabel-lke/komponen/${komponenId}/subKomponen/${subKomponenId}/kriteria/${kriteriaId}`);
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