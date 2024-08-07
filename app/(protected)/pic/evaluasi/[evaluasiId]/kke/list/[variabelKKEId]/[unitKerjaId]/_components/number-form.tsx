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
import { VariabelIKUUnitKerja } from "../_data/schema";

interface NumberFormProps {
  initialData: VariabelIKUUnitKerja;
  role: string
};

const formSchema = z.object({
  isian: z.string()
});

export const NumberForm = ({
  initialData, role
}: NumberFormProps) => {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isian: role === "at" ? initialData.isianAt || "" : (role === "kt" ? initialData.isianKt || "" : (role === "dalnis" ? initialData.isianDalnis || "" : (role === "pic" ? initialData.isianPIC || "" : "")))
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (role === "at") {
      const value = {
        values: {
          isianAt: values
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, value);
        toast.success("Isian IKU berhasil diperbarui");
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (role === "kt") {
      const value = {
        values: {
          isianKt: values
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, value);
        toast.success("Isian IKU berhasil diperbarui");
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (role === "dalnis") {
      const value = {
        values: {
          isianDalnis: values
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, value);
        toast.success("Isian IKU berhasil diperbarui");
      } catch {
        toast.error("Terdapat kesalahan");
      }
    }
    if (role === "pic") {
      const value = {
        values: {
          isianPIC: values
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, value);
        toast.success("Isian IKU berhasil diperbarui");
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
                <Input
                  disabled={initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.evaluasi?.status !== "publish"}
                  type="number"
                  placeholder="Isikan nilai"
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