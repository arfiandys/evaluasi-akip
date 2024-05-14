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
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = React.useState<string>(
    role === "at" ? initialData.isianAt || "" : (role === "kt" ? initialData.isianKt || "" : (role === "dalnis" ? initialData.isianDalnis || "" : ""))
  )

  const onvaluechange = (value: string) => {
    setLoading(true)
    let catatan = ""
    let nilai = ""
    if (value === "ya") {
      catatan = initialData.variabelLKE.catatanPositif || "";
      if (initialData.variabelLKE.kriteriaLKE?.bobot) {
        nilai = (initialData.variabelLKE.kriteriaLKE?.bobot * 100).toString();
      }
      if (initialData.variabelLKE.subKriteriaLKE?.bobot) {
        nilai = (initialData.variabelLKE.subKriteriaLKE?.bobot * 100).toString();
      }
    } else if (value === "tidak") {
      catatan = initialData.variabelLKE.catatanNegatif || "";
      if (initialData.variabelLKE.kriteriaLKE?.bobot) {
        nilai = (initialData.variabelLKE.kriteriaLKE?.bobot * 0).toString();
      }
      if (initialData.variabelLKE.subKriteriaLKE?.bobot) {
        nilai = (initialData.variabelLKE.subKriteriaLKE?.bobot * 0).toString();
      }
    }
    const onSubmit = async () => {
      if (role === "at") {
        const values = {
          values: {
            isianAt: value,
            catatanAt: catatan,
            nilaiAt: nilai
          },
          input: "input",
          role: "at",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
          router.refresh()

        } catch {
          toast.error("Something went wrong");
        } finally {
          setLoading(false)
        }
      }
      if (role === "kt") {
        const values = {
          values: {
            isianKt: value,
            catatanKt: catatan,
            nilaiKt: nilai
          },
          input: "input",
          role: "kt",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
          router.push(`/anggota/lke/list`);
          router.refresh()
        } catch {
          toast.error("Something went wrong");
        } finally {
          setLoading(false)
        }
      }
      if (role === "dalnis") {
        const values = {
          values: {
            isianDalnis: value,
            catatanDalnis: catatan,
            nilaiDalnis: nilai
          },
          input: "input",
          role: "dalnis",
          unitKerjaId: initialData.unitKerjaId
        }
        try {
          await axios.patch(`/api/lke/variabel/${initialData.variabelLKEId}`, values);
          toast.success("LKE unit kerja updated");
          router.push(`/anggota/lke/list`);
          router.refresh()
        } catch {
          toast.error("Something went wrong");
        } finally {
          setLoading(false)
        }
      }
    }
    onSubmit()
  }

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 z-[100] w-screen h-screen items-center block bg-primary/50">
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Select onValueChange={onvaluechange} defaultValue={selected}>
        {initialData.variabelLKE.variabelKKE ? (
          <SelectTrigger disabled>
            <SelectValue placeholder="Select yes/no" />
          </SelectTrigger>
        ) : (
          <SelectTrigger>
            <SelectValue placeholder="Select yes/no" />
          </SelectTrigger>
        )}
        <SelectContent>
          <SelectItem value="ya">Ya</SelectItem>
          <SelectItem value="tidak">Tidak</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}