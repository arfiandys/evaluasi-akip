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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KomponenLKE, UnitKerja, VariabelLKE } from "@prisma/client";
import { VariabelKKEUnitKerja } from "../_data/schema";

interface NumberFormProps {
  initialData: VariabelKKEUnitKerja;
  role: string;
};

const formSchema = z.object({
  isian: z.string()
});

export const NumberForm = ({
  initialData, role
}: NumberFormProps) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isian: role === "at" ? initialData.isianAt || "" : (role === "kt" ? initialData.isianKt || "" : (role === "dalnis" ? initialData.isianDalnis || "" : (role === "pic" ? initialData.isianPIC || "" : "")))
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    if (role === "at") {
      const value = {
        values: {
          isian: values
        },
        input: "input",
        jenis: "number",
        role: "at",
        unitKerjaId: initialData.unitKerjaId,
        variabelLKEId: initialData.variabelKKE.variabelLKEId,
      }
      try {
        await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, value);
        toast.success("Isian KKE berhasil diperbarui");
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setLoading(false)
      }
    }
    if (role === "kt") {
      const value = {
        values: {
          isian: values
        },
        input: "input",
        jenis: "number",
        role: "kt",
        unitKerjaId: initialData.unitKerjaId,
        variabelLKEId: initialData.variabelKKE.variabelLKEId,
      }
      try {
        await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, value);
        toast.success("Isian KKE berhasil diperbarui");
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");;
      } finally {
        setLoading(false)
      }
    }
    if (role === "dalnis") {
      const value = {
        values: {
          isian: values
        },
        input: "input",
        jenis: "number",
        role: "dalnis",
        unitKerjaId: initialData.unitKerjaId,
        variabelLKEId: initialData.variabelKKE.variabelLKEId,
      }
      try {
        await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, value);
        toast.success("Isian KKE berhasil diperbarui");
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setLoading(false)
      }
    }
    if (role === "pic") {
      const value = {
        values: {
          isian: values
        },
        input: "input",
        jenis: "number",
        role: "pic",
        unitKerjaId: initialData.unitKerjaId,
        variabelLKEId: initialData.variabelKKE.variabelLKEId,
      }
      try {
        await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, value);
        toast.success("Isian KKE berhasil diperbarui");
        router.refresh()
      } catch {
        toast.error("Terdapat kesalahan");
      } finally {
        setLoading(false)
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
                {initialData.variabelKKE.isIndikatorKinerja === true ? (
                  <Input
                    type="number"
                    disabled
                    placeholder="Isikan nilai"
                    {...field}
                  />
                ) : (
                  <Input
                    type="number"
                    disabled={initialData.variabelKKE.evaluasi?.status!=="publish"&&initialData.variabelKKE.evaluasi?.status!=="check"}
                    min={0}
                    max={100}
                    placeholder="Isikan nilai"
                    {...field}
                  />
                )}

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  )
}