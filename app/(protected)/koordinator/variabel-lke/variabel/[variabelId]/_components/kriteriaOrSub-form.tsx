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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KomponenLKE, KriteriaLKE, SubKomponenLKE, SubKriteriaLKE, VariabelLKE } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { KriteriaForm } from "./kriteria-form";
import { SubKriteriaForm } from "./subKriteria-form";

interface KriteriaOrSubFormProps {
  variabelLKE: VariabelLKE;
  variabelId: string;
  kriteria: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null })[];
  subKriteria: (SubKriteriaLKE & { kriteriaLKE: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null }) | null })[];
};

export const KriteriaOrSubForm = ({
  variabelLKE,
  variabelId,
  kriteria,
  subKriteria,
}: KriteriaOrSubFormProps) => {

  return (
    <>
      {!variabelLKE.isSubKriteria ? (
        <KriteriaForm
          initialData={variabelLKE}
          variabelId={variabelLKE.id}
          options={kriteria.map((kriteria) => ({
            label: kriteria.name,
            value: kriteria.id,
            data: kriteria
          }))}
        />
      ) : (
        <SubKriteriaForm
          initialData={variabelLKE}
          variabelId={variabelLKE.id}
          options={subKriteria.map((subKriteria) => ({
            label: subKriteria.name,
            value: subKriteria.id,
            data: subKriteria
          }))}
        />
      )}


    </>
  )
}