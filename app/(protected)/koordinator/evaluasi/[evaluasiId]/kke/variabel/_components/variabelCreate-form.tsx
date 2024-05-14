"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { KelompokKriteriaKKE, KriteriaKKE, VariabelLKE, } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CreateVariabelFormProps {
    kriteria_options: { label: string; value: string; data: KriteriaKKE & { kelompokKriteriaKKE: KelompokKriteriaKKE }; }[];
    variabelLKE_options: { label: string; value: string; data: VariabelLKE }[];
};

const formSchema = z.object({
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
    nama: z.string().min(1, {
        message: "Nama is required",
    }),
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    jenisIsian: z.string().min(1, {
        message: "Jenis isian is required",
    }),
    jenisIsianIKU: z.string(),
    isIndikatorKinerja: z.string().min(1),
    petunjukEvaluasi: z.string(),
    kriteriaKKEId: z.string().min(1, {
        message: "Kriteria is required",
    }),
    variabelLKEId: z.string().min(1, {
        message: "Variabel LKE is required",
    }),
});

const CreateVariabelPage = (
    {
        kriteria_options,
        variabelLKE_options
    }: CreateVariabelFormProps
) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const [selectedJKK, setSelectedJKK] = useState<string>(
        "false"
    )
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            nama: "",
            tahun: undefined,
            jenisIsian: "number",
            isIndikatorKinerja:"false",
            jenisIsianIKU: "",
            petunjukEvaluasi: "",
            kriteriaKKEId: "",
            variabelLKEId: "",
        },
        mode: "onChange"
    });

    const { isSubmitting, isValid } = form.formState;
    const { setValue, getValues, watch, resetField, reset } = form

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const value = {
            ...values,
            isIndikatorKinerja: (values.isIndikatorKinerja === "true")
        }
        try {
            const response = await axios.post("/api/kke/variabel", value);
            toast.success("Variabel created!")
            reset()
            router.refresh()
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const kriteriaId = watch("kriteriaKKEId");
    useEffect(() => {

        if (kriteriaId) {
            const selectedData = kriteria_options.find((option) => option.value === kriteriaId);
            const kodeKriteria = selectedData?.data.kode || "";
            setValue("kode", kodeKriteria,{ shouldValidate: true });
            setValue("nama", selectedData?.data.nama || "",{ shouldValidate: true });
            setValue("tahun", selectedData?.data.kelompokKriteriaKKE?.tahun || "",{ shouldValidate: true });
        }

    }, [kriteriaId, setValue, kriteria_options]);

    const jenisKK = watch("isIndikatorKinerja");

    useEffect(() => {
        if (jenisKK) {
            setSelectedJKK(jenisKK)
            resetField("jenisIsian")
            resetField("jenisIsianIKU")
        }

    }, [jenisKK, resetField])

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
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Tambah variabel KKE
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your variabel KKE? Don&apos;t worry.
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-8 space-y-4"
                        >
                            <div className="flex flex-row space-x-4 items-start justify-between w-full">
                                <FormField
                                    control={form.control}
                                    name="isIndikatorKinerja"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis kertas kerja
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue="false">
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a KK" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="true">KK Indikator Kinerja</SelectItem>
                                                    <SelectItem value="false">KK Evaluasi Dokumen</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                What will you do in this Variabel?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {!(selectedJKK === "true") ? (
                                        <FormField
                                            control={form.control}
                                            name="jenisIsian"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Jenis isian variabel
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih isian" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="select">
                                                                Select Yes / No
                                                            </SelectItem>
                                                            <SelectItem value="dropdown">
                                                                Dropdown A/B/C
                                                            </SelectItem>
                                                            <SelectItem value="number">
                                                                Number
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription>
                                                        What will you do in this Variabel?
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                ) : (
                                    <>
                                       
                                    </>
                                )}
                                {(selectedJKK === "true") ? (
                                        <FormField
                                        control={form.control}
                                        name="jenisIsianIKU"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Jenis isian IKU
                                                </FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih isian" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="select">
                                                            Select Yes / No
                                                        </SelectItem>
                                                        <SelectItem value="dropdown">
                                                            Dropdown A/B/C
                                                        </SelectItem>
                                                        <SelectItem value="number">
                                                            Number
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    What will you do in this Variabel?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <>
                                        
                                    </>
                                )}


                                <FormField
                                    control={form.control}
                                    name="petunjukEvaluasi"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Petunjuk
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. '......'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                What will you do in this Variabel?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kriteriaKKEId"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Kriteria KKE
                                            </FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={kriteria_options}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                What will you do in this Variabel?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="variabelLKEId"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Variabel LKE
                                            </FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={variabelLKE_options}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                What will you do in this Variabel?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default CreateVariabelPage;