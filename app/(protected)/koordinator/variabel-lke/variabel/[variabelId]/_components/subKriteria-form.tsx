"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, User2, X } from "lucide-react";
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

interface SubKriteriaFormProps {
  initialData: VariabelLKE;
  variabelId: string;
  options: { label: string; value: string; data: (SubKriteriaLKE & { kriteriaLKE: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null }) | null }); }[];
};

const formSchema = z.object({
  subKriteriaLKEId: z.string().min(1),
});

export const SubKriteriaForm = ({
  initialData,
  variabelId,
  options,
}: SubKriteriaFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subKriteriaLKEId: initialData?.subKriteriaLKEId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const selectedData = options.find((option) => option.value === values.subKriteriaLKEId);
    const kodeKomponen = selectedData?.data.kriteriaLKE?.subKomponenLKE?.komponenLKE?.kode || "";
    const kodeSubKomponen = selectedData?.data.kriteriaLKE?.subKomponenLKE?.kode || "";
    const kodeKriteria = selectedData?.data.kriteriaLKE?.kode || "";
    const kodeSubKriteria = selectedData?.data.kode || "";
    const kode = kodeKomponen.concat(".", kodeSubKomponen.concat(".",kodeKriteria.concat(".",kodeSubKriteria)))
    const value = {
      subKriteriaLKEId: values.subKriteriaLKEId,
      kode: kode,
      tahun: selectedData?.data.tahun,
      variabel: "subKriteria",
      action: "yearCodeGenerate"
    }
    try {
      await axios.patch(`/api/variabel-lke/variabel/${variabelId}`, value);
      toast.success("Variabel updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = options.find((option) => option.value === initialData.subKriteriaLKEId);

  return (
    <div className="mt-6 border bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Sub Kriteria LKE
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit sub kriteria
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.subKriteriaLKEId && "text-secondary-foreground italic"
        )}>
          {selectedOption?.label || "No sub kriteria"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="subKriteriaLKEId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                    {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}