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

interface DropdownFormProps {
  initialData: VariabelKKEUnitKerja;
};

export const DropdownForm = ({
  initialData,
}: DropdownFormProps) => {

  const router = useRouter();
  const [selected, setSelected] = React.useState<string>(
    initialData.isianAt || ""
  )

  const onvaluechange = (value:string) => {
    const onSubmit = async () => {
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
    onSubmit()
  }

  return (

    <Select onValueChange={onvaluechange} defaultValue={selected}>
      <SelectTrigger>
        <SelectValue placeholder="Select grade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
        <SelectItem value="b">B</SelectItem>
        <SelectItem value="c">C</SelectItem>
      </SelectContent>
    </Select>
  )
}