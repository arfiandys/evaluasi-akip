"use client"
import { Row } from "@tanstack/react-table"

import { LKEUnitKerjaSchema } from "../_data/schema"
import { NumberForm } from "./number-form"
import { SelectForm } from "./select-form"
import { DropdownForm } from "./dropdown-form"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface DataTableRowCatatanProps<TData> {
  row: Row<TData>;
  role: string;
}

const formSchema = z.object({
  isian: z.string()
});

export function DataTableRowCatatan<TData>({
  row, role
}: DataTableRowCatatanProps<TData>) {
  const initialData = LKEUnitKerjaSchema.parse(row.original)

  const router = useRouter();

  let form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      isian: role === "at" ? initialData.catatanAt || "" : (role === "kt" ? initialData.catatanKt || "" : (role === "dalnis" ? initialData.catatanDalnis || "" : ""))
    },
  });


  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (role === "at") {
      const value = {
        values: {
          catatanAt: values.isian
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, value);
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (role === "kt") {
      const value = {
        values: {
          catatanKt: values.isian
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, value);
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (role === "dalnis") {
      const value = {
        values: {
          catatanDalnis: values.isian
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, value);
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="isian"
          render={({ field }) => (
            <FormItem className="max-w-[250px]">
              <FormControl>
                <Textarea
                  disabled={initialData.variabelLKE.evaluasi?.status !== "publish" && initialData.variabelLKE.evaluasi?.status !== "check"}
                  placeholder="Isikan catatan manual"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  )

}
