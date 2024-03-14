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
import { VariabelKKEUnitKerja } from "../_data/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFormProps {
  initialData: VariabelKKEUnitKerja;
  role: string
};

export const SelectForm = ({
  initialData, role
}: SelectFormProps) => {

  const router = useRouter();
  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt || "" : (role === "kt" ? initialData.isianKt || "" : (role === "dalnis" ? initialData.isianDalnis || "" : (role === "pic" ? initialData.isianPIC || "" : "")))
  )

  const onvaluechange = (value: string) => {
    const onSubmit = async () => {
      if (role === "at") {
        const values = {
          values: {
            isianAt: value
          },
          input: "input",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("KKE unit kerja updated");
        } catch {
          toast.error("Something went wrong");
        }
      }
      if (role === "kt") {
        const values = {
          values: {
            isianKt: value
          },
          input: "input",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("KKE unit kerja updated");
        } catch {
          toast.error("Something went wrong");
        }
      }
      if (role === "dalnis") {
        const values = {
          values: {
            isianDalnis: value
          },
          input: "input",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("KKE unit kerja updated");
        } catch {
          toast.error("Something went wrong");
        }
      }
      if (role === "pic") {
        const values = {
          values: {
            isianPIC: value
          },
          input: "input",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("KKE unit kerja updated");
        } catch {
          toast.error("Something went wrong");
        }
      }
    }
    onSubmit()
  }

  return (

    <Select onValueChange={onvaluechange} defaultValue={selected}>
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