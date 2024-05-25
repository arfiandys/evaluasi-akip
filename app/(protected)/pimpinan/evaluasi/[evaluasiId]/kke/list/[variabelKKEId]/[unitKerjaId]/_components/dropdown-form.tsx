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
import { VariabelIKUUnitKerja } from "../_data/schema";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DropdownFormProps {
  initialData: VariabelIKUUnitKerja;
  role: string;
};

export const DropdownForm = ({
  initialData,
  role
}: DropdownFormProps) => {

  const router = useRouter();
  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt||"": (role === "kt" ? initialData.isianKt||"":(role === "dalnis" ? initialData.isianDalnis||"":(role === "pic" ? initialData.isianPIC||"":"")))
  )


  return (

    <Select defaultValue={selected} disabled>
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