"use client";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2, Pencil, Trash, User2, X } from "lucide-react";
import { TimEvaluasi, User, UserOnTimEvaluasi, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

interface UnitKerjaProps {
  value: UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } };
  initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
  timEvaluasiId: string;
  options_unitKerja: { label: string; value: string; }[];
  options_user: { label: string; value: string; }[];
};

export const UnitKerjaForm = ({
  value,
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
    unitKerjaId: z.string().min(1)
  });

  const currentUser = initialData.users.find(function (user) {
    return user.userId === value.userId;
  });

  const unitKerja = currentUser?.user.unitKerjas.filter(function (unit) {
    return unit.assignedRole === UserRole.ANGGOTA;
  }).map(function (unit) { return unit })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: value.userId,
      unitKerjaId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Tim Evaluasi updated");
      toggleAnggotaEdit();
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const values = {
        data: {
          anggotaTimEvaluasiId: id,
          action: "disconnect"
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Anggota deleted");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const onDeleteUnitKerja = async (userId: string, unitId: string) => {
    try {
      setDeletingUnitKerjaId(unitId);
      const values = {
        data: {
          anggotaTimEvaluasiId: userId,
          unitKerjaId: unitId,
          action: "disconnect"
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Anggota deleted");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
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
              {(options_user.find((option) => option.value === value.userId))?.label}
            </p>

            {deletingId === value.userId && (
              <div className="ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {deletingId !== value.userId && (
              <button
                onClick={() => onDelete(value.userId)}
                className="ml-auto hover:opacity-75 transition"
              >
                <Trash className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleAnggotaEdit}
              className="ml-1 hover:opacity-75 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4 text-primary"
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
                  Add
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-sm line-clamp-1">
            Unit kerja :
          </p>
          <div className="flex flex-wrap gap-y-2 gap-x-2 items-start px-5">
            {unitKerja?.map((unit) => (
              <div key={unit.unitKerjaId} className="flex items-center w-fit p-2 bg-sky-100 border-sky-200 border text-sky-700 rounded-2xl">
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
                  <button
                    onClick={() => onDeleteUnitKerja(value.userId, unit.unitKerjaId)}
                    className="ml-2 hover:opacity-75 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
        >
          <div className="flex items-center w-full">
            <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <p className="text-xs line-clamp-1">
              {(options_user.find((option) => option.value === value.userId))?.label}
            </p>

            {deletingId === value.userId && (
              <div className="ml-auto">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {deletingId !== value.userId && (
              <button
                onClick={toggleAnggotaEdit}
                className="ml-auto hover:opacity-75 transition"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}