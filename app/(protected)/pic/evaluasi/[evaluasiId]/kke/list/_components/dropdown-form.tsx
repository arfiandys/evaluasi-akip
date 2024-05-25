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
  role: string;
};

export const DropdownForm = ({
  initialData,
  role
}: DropdownFormProps) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt||"": (role === "kt" ? initialData.isianKt||"":(role === "dalnis" ? initialData.isianDalnis||"":(role === "pic" ? initialData.isianPIC||"":"")))
  )

  const onvaluechange = (value:string) => {
    setLoading(true)
    const onSubmit = async () => {
      if (role === "at") {
        const values = {
          values: {
            isian: value
          },
          input: "input",
          jenis: "dropdown",
          role: "at",
          unitKerjaId: initialData.unitKerjaId,
          variabelLKEId: initialData.variabelKKE.variabelLKEId,
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
        toast.success("Isian KKE berhasil diperbarui");
        } catch {
          toast.error("Terdapat kesalahan");
        } finally {
          setLoading(false)
        }
      }
      if (role === "kt") {
        const values = {
          values: {
            isian: value
          },
          input: "input",
          jenis: "dropdown",
          role: "kt",
          unitKerjaId: initialData.unitKerjaId,
          variabelLKEId: initialData.variabelKKE.variabelLKEId,
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
        toast.success("Isian KKE berhasil diperbarui");
        } catch {
          toast.error("Terdapat kesalahan");
        } finally {
          setLoading(false)
        }
      }
      if (role === "dalnis") {
        const values = {
          values: {
            isian: value
          },
          input: "input",
          jenis: "dropdown",
          role: "dalnis",
          unitKerjaId: initialData.unitKerjaId,
          variabelLKEId: initialData.variabelKKE.variabelLKEId,
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("Isian KKE berhasil diperbarui");
        } catch {
          toast.error("Terdapat kesalahan");
        } finally {
          setLoading(false)
        }
      }
      if (role === "pic") {
        const values = {
          values: {
            isian: value
          },
          input: "input",
          jenis: "dropdown",
          role: "pic",
          unitKerjaId: initialData.unitKerjaId,
        }
        try {
          await axios.patch(`/api/kke/variabel/${initialData.variabelKKEId}`, values);
          toast.success("Isian KKE berhasil diperbarui");
        } catch {
          toast.error("Terdapat kesalahan");
        } finally {
          setLoading(false)
        }
      }      
    }
    onSubmit()
  }

  return (

    <Select onValueChange={onvaluechange} defaultValue={selected} disabled={initialData.variabelKKE.evaluasi?.status!=="publish"}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih nilai" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">A</SelectItem>
        <SelectItem value="b">B</SelectItem>
        <SelectItem value="c">C</SelectItem>
      </SelectContent>
    </Select>
  )
}