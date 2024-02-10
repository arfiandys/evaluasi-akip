"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, User2, X } from "lucide-react";
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
import { TimEvaluasi, UserOnTimEvaluasi, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

interface AnggotaFormProps {
  initialData: TimEvaluasi & { users: UserOnTimEvaluasi[] };
  timEvaluasiId: string;
  options: { label: string; value: string; }[];

};

const formSchema = z.object({
  anggotaTimEvaluasiId: z.string().min(1)
});

export const AnggotaForm = ({
  initialData,
  timEvaluasiId,
  options,
}: AnggotaFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const anggota = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.ANGGOTA;
  }).map(function (user) { return user })

  const anggotaId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.ANGGOTA;
  }).map(function (user) { return user.userId })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anggotaTimEvaluasiId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/tim-eval/${timEvaluasiId}`, values);
      toast.success("Tim Evaluasi updated");
      toggleEdit();
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
      await axios.patch(`/api/tim-eval/${timEvaluasiId}`, values);
      toast.success("Anggota deleted");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
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
          {anggotaId.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No anggota yet
            </p>
          )}
          {anggotaId.length > 0 && (
            <div className="space-y-2 mt-2">
              {anggota.map((anggota) => (
                <div
                  key={anggota.userId}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                  {(options.find((option) => option.value === anggota.userId))?.label}
                  </p>
                  {deletingId === anggota.userId && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== anggota.userId && (
                    <button
                      onClick={() => onDelete(anggota.userId)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
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