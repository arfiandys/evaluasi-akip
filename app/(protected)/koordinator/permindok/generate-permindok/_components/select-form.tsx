"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
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

export const SelectForm = ({
  initialData,
}: SelectFormProps) => {

  const router = useRouter();
  const [selected, setSelected] = React.useState<string>(
    initialData.isianAt || ""
  )



  useEffect(() => {
    const onSubmit = async () => {
      const value = {
        values: {
          isianAt: selected
        },
        input: "input",
        unitKerjaId: initialData.unitKerjaId
      }
      try {
        await axios.patch(`/api/variabel-lke/variabel/${initialData.variabelLKEId}`, value);
        toast.success("LKE unit kerja updated");
      } catch {
        toast.error("Something went wrong");
      }
    }
    onSubmit()
  }, [selected, initialData.unitKerjaId, initialData.variabelLKEId]);

  return (

    <Select onValueChange={setSelected} defaultValue={selected}>
      <SelectTrigger>
        <SelectValue placeholder="Select yes/no" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ya">Ya</SelectItem>
        <SelectItem value="tidak">Tidak</SelectItem>
      </SelectContent>
    </Select>
  )
}