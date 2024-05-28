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
import { TimEvaluasi, User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface KetuaFormProps {
  initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
  timEvaluasiId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  ketuaTimEvaluasiId: z.string().min(1),
  ketuaPassTimEvaluasiId: z.string(),
});

export const KetuaForm = ({
  initialData,
  timEvaluasiId,
  options,
}: KetuaFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const existingAnggota = initialData.users.some((item) => item.assignedRole === UserRole.ANGGOTA)

  const toggleEdit = () => setIsEditing((current) => !current);



  const ketuaId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.KETUA;
  }).map(function (user) { return user.userId })

  const isUnitKerjaInAnggota = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.ANGGOTA;
  }).map(function (user) { return user.user.unitKerjas })

  function allArraysEmpty(arr: any[][]): boolean {
    // Check if there are no arrays
    if (arr.length === 0) {
      return true;
    }

    // Check if every array is empty
    return arr.every(subArr => subArr.length === 0);
  }

  const isEmpty = allArraysEmpty(isUnitKerjaInAnggota)

  const arrayOfArrays: UserOnUnitKerja[][] = isUnitKerjaInAnggota;

  const concatenatedArray: UserOnUnitKerja[] = arrayOfArrays.reduce((acc, curr) => acc.concat(curr), []);
  const unitKerjaIdArray: any[] = concatenatedArray.map(obj => (
    {
      assignedRole: UserRole.KETUA,
      timEvaluasiId: timEvaluasiId,
      unitKerja: {
        connect: {
          id: obj.unitKerjaId,
        },
      },
    })
  );

  // TODO: MEMBUAT KONDISIONAL CREATE DAN DELETE KETIKA UNIT KERJA SUDAH DITAMBAHKAN MAKA KETUA DAN DALNIS HANYA BISA MENGUBAH

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ketuaTimEvaluasiId: ketuaId[0] || "",
      ketuaPassTimEvaluasiId: ketuaId[0] || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const value = {
      ...values,
      unitKerjaIdArray,
      action: "ketuaUpdateUnitKerja"
    }
    const value1 = {
      ...values,
      unitKerjaIdArray,
      action: "ketuaUpdate"
    }
    const value2 = {
      ...values,
      unitKerjaIdArray,
      action: "ketuaUpdateDisconnectUnitKerja"
    }

    if (!unitKerjaIdArray.length) {
      try {
        const response = await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value1);
        if (response.data.error) {
          toast.error(response.data.error)
        } else {
          toast.success("Ketua berhasil diperbarui");
        }
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (!!unitKerjaIdArray.length) {
      try {
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value2);
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
      try {
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value1);
        toast.success("Ketua berhasil diperbarui");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
      try {
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value);
        toast.success("Unit Kerja Ketua berhasil diperbarui");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }

  }

  const onDelete = async (id: string) => {
    if (existingAnggota) {
      toast.error("Tidak bisa menghapus ketua, hapus terlebih dahulu anggota");
    } else {
      try {
        setDeletingId(id);
        const values = {
          data: {
            ketuaTimEvaluasiId: id,
            action: "disconnect-ketua"
          }
        };
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
        toast.success("Ketua berhasil dihapus");
        form.reset();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setDeletingId(null);
      }
    }
  }

  const selectedOption = options.find((option) => option.value === ketuaId[0]);

  return (
    <div className="border bg-background rounded-3xl p-4">
      <div className="font-medium flex items-center justify-between">
        Ketua tim evaluasi
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
              Belum ada ketua
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
                {deletingId === ketuaId[0] && (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingId !== ketuaId[0] && (
                  <ConfirmModal onConfirm={()=> onDelete(ketuaId[0])}>
                    <button
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </ConfirmModal>
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
              name="ketuaTimEvaluasiId"
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