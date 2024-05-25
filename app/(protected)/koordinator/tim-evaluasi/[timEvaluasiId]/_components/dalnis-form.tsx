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

interface DalnisFormProps {
  initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
  timEvaluasiId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  dalnisTimEvaluasiId: z.string().min(1),
  dalnisPassTimEvaluasiId: z.string(),
});

export const DalnisForm = ({
  initialData,
  timEvaluasiId,
  options,
}: DalnisFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const existingKetua = initialData.users.some((item) => item.assignedRole === UserRole.KETUA)

  const toggleEdit = () => setIsEditing((current) => !current);



  const dalnisId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.DALNIS;
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
      assignedRole: UserRole.DALNIS,
      timEvaluasiId: timEvaluasiId,
      unitKerja: {
        connect: {
          id: obj.unitKerjaId,
        },
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dalnisTimEvaluasiId: dalnisId[0] || "",
      dalnisPassTimEvaluasiId: dalnisId[0] || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const value = {
      ...values,
      unitKerjaIdArray,
      action: "dalnisUpdateUnitKerja"
    }
    const value1 = {
      ...values,
      unitKerjaIdArray,
      action: "dalnisUpdate"
    }
    const value2 = {
      ...values,
      unitKerjaIdArray,
      action: "dalnisUpdateDisconnectUnitKerja"
    }

    if (!unitKerjaIdArray.length) {
      try {
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value1);
        toast.success("Dalnis berhasil diperbarui");
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
        toast.success("Dalnis berhasil diperbarui");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
      try {
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value);
        toast.success("Unit Kerja Dalnis berhasil diperbarui");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }

  }

  const onDelete = async (id: string) => {
    if (existingKetua) {
      toast.error("Tidak bisa menghapus dalnis, hapus terlebih dahulu ketua");
    } else {
      try {
        setDeletingId(id);
        const values = {
          data: {
            dalnisTimEvaluasiId: id,
            action: "disconnect-dalnis"
          }
        };
        await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
        toast.success("Dalnis berhasil dihapus");
        form.reset();
        router.refresh();
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setDeletingId(null);
      }
    }
  }

  const selectedOption = options.find((option) => option.value === dalnisId[0]);

  return (
    <div className="border bg-background rounded-3xl p-4">
      <div className="font-medium flex items-center justify-between">
        Pengendali teknis
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
              Belum ada pengendali teknis
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
                {deletingId === dalnisId[0] && (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingId !== dalnisId[0] && (
                  <button
                    onClick={() => onDelete(dalnisId[0])}
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
              name="dalnisTimEvaluasiId"
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