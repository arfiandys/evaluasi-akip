"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle, Trash, User2, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { UnitKerja, User, UserOnUnitKerja, UserRole } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { db } from "@/lib/db";

interface PICFormProps {
  initialData: UnitKerja & { users: UserOnUnitKerja[] };
  unitKerjaId: string;
  options: { label: string; value: string; }[];

};

const formSchema = z.object({
  picUnitKerjaId: z.string().min(1)
});

export const PICForm = ({
  initialData,
  unitKerjaId,
  options,
}: PICFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const pic = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.PIC;
  }).map(function (user) { return user })

  const picId = initialData.users.filter(function (user) {
    return user.assignedRole === UserRole.PIC;
  }).map(function (user) { return user.userId })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      picUnitKerjaId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/unit-kerja/${unitKerjaId}`, values);
      toast.success("PIC berhasil diperbarui");
      toggleEdit();
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
          picUnitKerjaId: id,
          action: "disconnect"
        }
      };
      await axios.patch(`/api/unit-kerja/${unitKerjaId}`, values);
      toast.success("PIC berhasil dihapus");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Terdapat kesalahan");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="border bg-background rounded-3xl p-4">
      <div className="font-medium flex items-center justify-between">
        PIC unit kerja
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Baru
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {picId.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              Belum ada PIC
            </p>
          )}
          {picId.length > 0 && (
            <div className="space-y-2 mt-2">
              {pic.map((pic) => (
                <div
                  key={pic.userId}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <User2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {(options.find((option) => option.value === pic.userId))?.label}
                  </p>
                  {deletingId === pic.userId && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== pic.userId && (
                    <button
                      onClick={() => onDelete(pic.userId)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <Trash className="h-4 w-4" />
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
              name="picUnitKerjaId"
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
                Tambah
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}