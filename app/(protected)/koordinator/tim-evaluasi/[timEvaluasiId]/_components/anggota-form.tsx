"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building, Loader2, Pencil, PlusCircle, User2, X } from "lucide-react";
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
import { UnitKerjaForm } from "./unit-kerja-form";


interface AnggotaFormProps {
  initialData: TimEvaluasi & { users: (UserOnTimEvaluasi & { user: User & { unitKerjas: UserOnUnitKerja[] } })[] };
  initialData_User: (User & { unitKerjas: UserOnUnitKerja[] })[];
  timEvaluasiId: string;
  options: { label: string; value: string; }[];
  options_unitKerja: { label: string; value: string; }[];

};

const formSchema = z.object({
  anggotaTimEvaluasiId: z.string().min(1)
});

export const AnggotaForm = ({
  initialData,
  initialData_User,
  timEvaluasiId,
  options,
  options_unitKerja
}: AnggotaFormProps) => {
  const [isEditing, setIsEditing] = useState(false);


  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const anggota = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.ANGGOTA;
  }).map(function (user) { return user })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anggotaTimEvaluasiId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Tim Evaluasi updated");
      toggleEdit();
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Anggota tim evaluasi
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add anggota
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {anggota.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No anggota yet
            </p>
          )}
          {anggota.length > 0 && (
            <div className="space-y-2 mt-2">
              {anggota.map((anggota) => (
                <div key={anggota.userId}>
                  <UnitKerjaForm
                    value={anggota}
                    initialData={initialData}
                    timEvaluasiId={timEvaluasiId}
                    options_unitKerja={options_unitKerja}
                    options_user={options}
                  />
                </div>

              ))}
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
              name="anggotaTimEvaluasiId"
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
                Add
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}