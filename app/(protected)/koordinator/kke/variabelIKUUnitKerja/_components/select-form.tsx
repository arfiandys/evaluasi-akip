"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import { VariabelIKUUnitKerja } from "../_data/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFormProps {
  initialData: VariabelIKUUnitKerja;
};

export const SelectForm = ({
  initialData,
}: SelectFormProps) => {

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
        await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, values);
        toast.success("IKU unit kerja updated");
        router.refresh()
      } catch {
        toast.error("Something went wrong");
      }
    }
    onSubmit()
  }

  // const effectRan = useRef(false);

  // useEffect(() => {

  //   if (effectRan.current === true) {
  //     const onSubmit = async () => {
  //       const value = {
  //         values: {
  //           isianAt: selected
  //         },
  //         input: "input",
  //         unitKerjaId: initialData.unitKerjaId
  //       }
  //       try {
  //         await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, value);
  //         toast.success("IKU unit kerja updated");
  //       } catch {
  //         toast.error("Something went wrong");
  //       }
  //     }
  //     onSubmit()
  //   }
  //   return () => {
  //     console.log(selected)
  //     effectRan.current = true
  //   }
  // }, [selected, initialData.tujuanSasaranIndikatorIKUVariabelKKEId, initialData.unitKerjaId]);

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