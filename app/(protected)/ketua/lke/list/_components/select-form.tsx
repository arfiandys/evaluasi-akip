"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LKEUnitKerja } from "../_data/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectFormProps {
  initialData: LKEUnitKerja;
  role: string;
};

export const SelectForm = ({
  initialData,
  role
}: SelectFormProps) => {

  const router = useRouter();

  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt||"": (role === "kt" ? initialData.isianKt||"":(role === "dalnis" ? initialData.isianDalnis||"":""))
  )

  const onvaluechange = (value:string) => {
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
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
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
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
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
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
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