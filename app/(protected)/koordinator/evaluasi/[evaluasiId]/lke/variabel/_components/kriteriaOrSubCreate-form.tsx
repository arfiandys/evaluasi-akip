"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, RefreshCcw } from "lucide-react";
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
import CreateVariabelPage from "./kriteriaCreate-form";
import SubCreateVariabelPage from "./subKriteriaCreate-form";

interface KriteriaOrSubCreateFormProps {
  kriteria: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null })[];
  subKriteria: (SubKriteriaLKE & { kriteriaLKE: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null }) | null })[];
};

export const KriteriaOrSubCreateForm = ({
  kriteria,
  subKriteria,
}: KriteriaOrSubCreateFormProps) => {
  const [isKriteria, setIsKriteria] = useState(false);
  const toggleKriteria = () => setIsKriteria((currents) => !currents);
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <>
      <div className="flex flex-col gap-y-4 ml-auto justify-end my-2">

        <Button onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add variabel
            </>
          )}
        </Button>
      </div>
      {isEditing ? (
        <>
        <div className="flex flex-col gap-y-4 ml-auto justify-end my-2">
          <Button onClick={toggleKriteria}>
            {isKriteria ? (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Swipe ke sub kriteria
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Swipe ke kriteria
              </>
            )}
          </Button>
          </div>

          {isKriteria ? (
            <CreateVariabelPage
              kriteria_options={kriteria.map((kriteria) => ({
                label: kriteria.name,
                value: kriteria.id,
                data: kriteria
              }))}
            />
          ) : (

            <SubCreateVariabelPage
              subKriteria_options={subKriteria.map((subKriteria) => ({
                label: subKriteria.name,
                value: subKriteria.id,
                data: subKriteria
              }))}
            />
          )}
        </>
      ) : (
        <></>
      )}

    </>
  )
}