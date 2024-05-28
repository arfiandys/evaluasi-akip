"use client";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2, MoreVertical, Pencil, PlusCircle, Trash, User2, X } from "lucide-react";
import { TimEvaluasi, User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface UnitKerjaProps {
  anggota: UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } };
  ketua: string | undefined;
  dalnis: string | undefined;
  initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
  timEvaluasiId: string;
  options_unitKerja: { label: string; value: string; }[];
  options_user: { label: string; value: string; }[];
};

export const UnitKerjaForm = ({
  anggota,
  ketua,
  dalnis,
  initialData,
  timEvaluasiId,
  options_unitKerja,
  options_user
}: UnitKerjaProps) => {
  const [isAnggotaEditing, setAnggotaIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingUnitKerjaId, setDeletingUnitKerjaId] = useState<string | null>(null);
  const toggleAnggotaEdit = () => { setAnggotaIsEditing((current_anggota) => !current_anggota) };

  const router = useRouter();

  const formSchema = z.object({
    userId: z.string().min(1),
    ketuaId: z.string().min(1),
    dalnisId: z.string().min(1),
    unitKerjaId: z.string().min(1)
  });

  const currentUser = initialData.users.find(function (user) {
    return user.userId === anggota.userId;
  });

  const unitKerja = currentUser?.user.unitKerjas.filter(function (unit) {
    return unit.assignedRole === UserRole.ANGGOTA && unit.timEvaluasiId === timEvaluasiId;
  }).map(function (unit) { return unit })

  const unitKerjaId_arr: string[] = []

  currentUser?.user.unitKerjas.forEach((unit) => {
    if (unit.assignedRole === UserRole.ANGGOTA) {
      unitKerjaId_arr.push(unit.unitKerjaId)
    }
  })
  console.log(unitKerjaId_arr)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: anggota.userId,
      ketuaId: ketua,
      dalnisId: dalnis,
      unitKerjaId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const value = {
      ...values,
      action: "addUnitKerja"
    }
    try {
      const response = await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, value);
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success("Unit kerja berhasil diperbarui");
      }
      toggleAnggotaEdit();
      form.reset();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const values = {
        data: {
          action: "disconnect-anggota-unitkerja",
          unitKerjaId_arr: unitKerjaId_arr
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("UnitKerja berhasil dihapus");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setDeletingId(null);
    }
    try {
      setDeletingId(id);
      const values = {
        data: {
          anggotaTimEvaluasiId: id,
          action: "disconnect-anggota"
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Anggota berhasil dihapus");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setDeletingId(null);
    }
  }

  const onDeleteUnitKerja = async (userId: string, unitId: string) => {
    try {
      setDeletingUnitKerjaId(unitId);
      const values = {
        data: {
          unitKerjaId: unitId,
          action: "disconnect-unitkerja"
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Unit kerja berhasil dihapus");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setDeletingUnitKerjaId(null);
    }
  }

  return (
    <>
      {(isAnggotaEditing) ? (
        <div
          className="flex flex-col gap-y-2  p-3 w-full bg-background border rounded-md"
        >
          <div className="flex items-center w-full">
            <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-md line-clamp-1">
              {(options_user.find((option) => option.value === anggota.userId))?.label}
            </p>

            {deletingId === anggota.userId && (
              <div className="ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            <button
              onClick={toggleAnggotaEdit}
              className="ml-auto hover:opacity-75 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="unitKerjaId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox
                        options={options_unitKerja}
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
                  Tambah
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-sm line-clamp-1">
            Unit kerja :
          </p>
          <div className="flex flex-wrap gap-y-2 gap-x-2 items-start px-5">
            {unitKerja?.map((unit) => (
              <div key={unit.unitKerjaId} className="flex items-center w-fit p-2 bg-secondary text-secondary-foreground rounded-2xl">
                <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs line-clamp-1">
                  {(options_unitKerja.find((option) => option.value === unit.unitKerjaId))?.label}
                </p>

                {deletingUnitKerjaId === unit.unitKerjaId && (
                  <div className="ml-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
                {deletingUnitKerjaId !== unit.unitKerjaId && (
                  <ConfirmModal onConfirm={() => onDeleteUnitKerja(anggota.userId, unit.unitKerjaId)}>
                    <button
                      className="ml-2 hover:opacity-75 transition"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </ConfirmModal>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col p-3 w-full bg-secondary text-secondary-foreground rounded-md"
        >
          <div className="flex items-center w-full">
            <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-xs line-clamp-1">
              {(options_user.find((option) => option.value === anggota.userId))?.label}
            </p>

            {deletingId === anggota.userId && (
              <div className="ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {deletingId !== anggota.userId && (
              <ConfirmModal onConfirm={() => onDelete(anggota.userId)}>
                <button
                  className="ml-auto hover:opacity-75 transition"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </ConfirmModal>
            )}
            <MoreVertical />
            {deletingId !== anggota.userId && (
              <button
                onClick={toggleAnggotaEdit}
                className="hover:opacity-75 transition flex flex-row justify-center items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">Tambah unit kerja</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}