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
import { LKEUnitKerja } from "../_data/schema";

interface NumberFormProps {
  initialData: LKEUnitKerja;
};

const formSchema = z.object({
  isianAt: z.string()
});

export const NumberForm = ({
  initialData,
}: NumberFormProps) => {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isianAt: initialData.isianAt || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const value = {
      values: values,
      input: "input",
      unitKerjaId: initialData.unitKerjaId
    }
    try {
      await axios.patch(`/api/variabel-lke/variabel/${initialData.variabelLKEId}`, value);
      // toast.success("LKE unit kerja updated");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form
        onChange={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="isianAt"
          render={({ field }) => (
            <FormItem className="max-w-[250px]">
              <FormControl>
                <Input

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