"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CatatanProps {
  initialData: {
    catatanPositif: string | null;
    catatanNegatif: string | null;
    catatanA: string | null;
    catatanB: string | null;
    catatanC: string | null;
    jenisIsian: string;
  };
  variabelId: string;
};

const formSchema = z.object({
  catatanNegatif: z.string(),
  catatanPositif: z.string(),
  catatanA: z.string(),
  catatanB: z.string(),
  catatanC: z.string(),
});

export const CatatanForm = ({
  initialData,
  variabelId
}: CatatanProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      catatanNegatif: initialData.catatanNegatif || "",
      catatanPositif: initialData.catatanPositif || "",
      catatanA: initialData.catatanA || "",
      catatanB: initialData.catatanB || "",
      catatanC: initialData.catatanC || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/lke/variabel/${variabelId}`, values);
      toast.success("Variabel updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Jenis isian
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit jenis isian
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        initialData.jenisIsian === "dropdown" ? (
          <div>
            <p className="text-sm mt-2">Catatan A</p>
            <p className="text-xs mt-2">
              {`"${initialData.catatanA||""}"`}
            </p>
            <p className="text-sm mt-2">Catatan B</p>
            <p className="text-xs mt-2">
              {`"${initialData.catatanA||""}"`}
            </p>
            <p className="text-sm mt-2">Catatan C</p>
            <p className="text-xs mt-2">
              {`"${initialData.catatanA||""}"`}
            </p>
          </div>
        ) : (initialData.jenisIsian === "select" ? (
          <div>
            <p className="text-sm mt-2">Catatan Ya</p>
            <p className="text-xs mt-2">
              {`"${initialData.catatanPositif||""}"`}
            </p>
            <p className="text-sm mt-2">Catatan Tidak</p>
            <p className="text-xs mt-2">
              {`"${initialData.catatanNegatif||""}"`}
            </p>
          </div>
        ) : (
          <></>
        ))
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            {initialData.jenisIsian === "select" ? (
              <>
                <FormField
                  control={form.control}
                  name="catatanNegatif"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Catatan Negatif
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. 'blablabla...'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What will you do in this Variabel?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="catatanPositif"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        Catatan Positif
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g. 'blablabla...'"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        What will you do in this Variabel?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              initialData.jenisIsian === "dropdown" ? (
                <>
                  <FormField
                    control={form.control}
                    name="catatanA"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Catatan A
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. 'blablabla...'"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What will you do in this Variabel?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="catatanB"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Catatan B
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. 'blablabla...'"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What will you do in this Variabel?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="catatanC"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Catatan C
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g. 'blablabla...'"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What will you do in this Variabel?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <>
                </>
              )
            )}
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