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
  role: string
};

export const SelectForm = ({
  initialData, role
}: SelectFormProps) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt || "" : (role === "kt" ? initialData.isianKt || "" : (role === "dalnis" ? initialData.isianDalnis || "" : (role === "pic" ? initialData.isianPIC || "" : "")))
  )

  const onvaluechange = (value: string) => {
    setLoading(true)
    const onSubmit = async () => {
      if (role === "at") {
        const values = {
          values: {
            isian: value
          },
          input: "input",
          unitKerjaId: initialData.unitKerjaId,
          variabelKKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKEId,
          variabelLKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.variabelLKEId,
          role: "at",
        }
        try {
          await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, values);
          router.refresh();
          toast.success("Isian IKU berhasil diperbarui");
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
          unitKerjaId: initialData.unitKerjaId,
          variabelKKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKEId,
          variabelLKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.variabelLKEId,
          role: "kt",
        }
        try {
          await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, values);
          router.refresh();
          toast.success("Isian IKU berhasil diperbarui");
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
          unitKerjaId: initialData.unitKerjaId,
          variabelKKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKEId,
          variabelLKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.variabelLKEId,
          role: "dalnis",
        }
        try {
          await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, values);
          router.refresh();
          toast.success("Isian IKU berhasil diperbarui");
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
          unitKerjaId: initialData.unitKerjaId,
          variabelKKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKEId,
          variabelLKEId: initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.variabelLKEId,
          role: "pic",
        }
        try {
          await axios.patch(`/api/kke/variabel-iku/${initialData.tujuanSasaranIndikatorIKUVariabelKKEId}`, values);
          router.refresh();
          toast.success("Isian IKU berhasil diperbarui");
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

    <Select onValueChange={onvaluechange} defaultValue={selected}
      disabled={initialData.tujuanSasaranIndikatorIKUVariabelKKE.variabelKKE?.evaluasi?.status !== "publish"}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih Ya/Tidak" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ya">Ya</SelectItem>
        <SelectItem value="tidak">Tidak</SelectItem>
      </SelectContent>
    </Select>
  )
}