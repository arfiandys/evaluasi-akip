"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, User2, X } from "lucide-react";
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

interface KetuaFormProps {
  initialData: TimEvaluasi & { users: UserOnTimEvaluasi[] };
  timEvaluasiId: string;
  options: { label: string; value: string; }[];
};

const formSchema = z.object({
  ketuaTimEvaluasiId: z.string().min(1),
  ketuaPassTimEvaluasiId: z.string()
});

export const KetuaForm = ({
  initialData,
  timEvaluasiId,
  options,
}: KetuaFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const ketuaId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.KETUA;
  }).map(function (user) { return user.userId })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ketuaTimEvaluasiId: ketuaId[0] || "",
      ketuaPassTimEvaluasiId: ketuaId[0] || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Tim evaluasi updated");
      toggleEdit();
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
          ketuaTimEvaluasiId: id,
          action: "disconnect"
        }
      };
      await axios.patch(`/api/tim-evaluasi/${timEvaluasiId}`, values);
      toast.success("Ketua deleted");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const selectedOption = options.find((option) => option.value === ketuaId[0]);

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Ketua tim evaluasi
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit ketua
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {!selectedOption?.label && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No ketua yet
            </p>
          )}
          {selectedOption?.label && (
            <div className="space-y-2 mt-2">
              <div
                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
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
                  <button
                    onClick={() => onDelete(ketuaId[0])}
                    className="ml-auto hover:opacity-75 transition"
                  >
                    <X className="h-4 w-4" />
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}