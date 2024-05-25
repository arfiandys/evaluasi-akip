"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Trash, User2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UnitKerja, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface PimpinanFormProps {
  initialData: UnitKerja & { users: UserOnUnitKerja[] };
  unitKerjaId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  pimpinanUnitKerjaId: z.string().min(1),
  pimpinanPassUnitKerjaId: z.string()
});

export const PimpinanForm = ({
  initialData,
  unitKerjaId,
  options,
}: PimpinanFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const existingPIC = initialData.users.some((item) => item.assignedRole === UserRole.PIC)

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const pimpinanId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.PIMPINAN;
  }).map(function (user) { return user.userId })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pimpinanUnitKerjaId: pimpinanId[0] || "",
      pimpinanPassUnitKerjaId: pimpinanId[0] || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/unit-kerja/${unitKerjaId}`, values);
      toast.success("Pimpinan berhasil diperbarui");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    }
  }

  const onDelete = async (id: string) => {
    if (existingPIC) {
      toast.error("Tidak bisa menghapus pimpinan, hapus terlebih dahulu PIC")
    } else {
      try {
        setDeletingId(id);
        const values = {
          data: {
            pimpinanUnitKerjaId: id,
            action: "disconnect"
          }
        };
        await axios.patch(`/api/unit-kerja/${unitKerjaId}`, values);
        toast.success("Pimpinan berhasil dihapus");
        form.reset();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setDeletingId(null);
      }
    }
  }

  const selectedOption = options.find((option) => option.value === pimpinanId[0]);

  return (
    <div className="border bg-background rounded-3xl p-4">
      <div className="font-medium flex items-center justify-between">
        Pimpinan unit kerja
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {!selectedOption?.label && (
            <p className="text-sm mt-2 text-slate-500 italic">
              Belum ada pimpinan
            </p>
          )}
          {selectedOption?.label && (
            <div className="space-y-2 mt-2">
              <div
                className="flex items-center p-3 w-full bg-secondary text-secondary-foreground rounded-md"
              >
                <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">
                  {selectedOption?.label}
                </p>
                {deletingId === pimpinanId[0] && (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingId !== pimpinanId[0] && (
                  <button
                    onClick={() => onDelete(pimpinanId[0])}
                    className="ml-auto hover:opacity-75 transition"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="pimpinanUnitKerjaId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}