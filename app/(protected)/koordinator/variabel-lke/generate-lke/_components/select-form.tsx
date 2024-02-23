"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LKEUnitKerja } from "../_data/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFormProps {
  initialData: LKEUnitKerja;
};

const formSchema = z.object({
  isianAt: z.string()
});

export const SelectForm = ({
  initialData,
}: SelectFormProps) => {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isianAt: initialData.isianAt || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { watch } = form
  const isian = watch("isianAt")

  const onSubmit = async (isian:string) => {
    const value = {
      values: {
          isianAt: isian
      },
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
  useEffect(() => {
    onSubmit(isian)
  },[isian]);

  return (
    <Form {...form}>
      <form
        // onChange={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="isianAt"
          render={({ field }) => (
            <FormItem className="max-w-[250px]">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select yes/no" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ya">Ya</SelectItem>
                  <SelectItem value="tidak">Tidak</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  )
}