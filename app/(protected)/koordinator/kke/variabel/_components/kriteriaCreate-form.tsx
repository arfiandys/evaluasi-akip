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
    tahun: z.coerce.number().min(1, {
        message: "Tahun is required",
    }),
    jenisIsian: z.string().min(1, {
        message: "Jenis isian is required",
    }),
    isIndikatorKinerja: z.coerce.boolean(),
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
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",   
            nama: "",
            tahun: undefined,
            jenisIsian: "",
            kriteriaKKEId: "",
            variabelLKEId: "",
        },
        mode: "onChange"
    });

    const { isSubmitting, isValid } = form.formState;
    const { setValue, getValues, watch } = form

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/kke/variabel", values);
            // router.push(`/koordinator/kke/variabel/${response.data.id}`);
            toast.success("Variabel created!")
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
            setValue("kode", kodeKriteria);
            setValue("nama", selectedData?.data.name || "");
            setValue("jenisIsian", selectedData?.data.jenisIsian || "");
            setValue("tahun", Number(selectedData?.data.kelompokKriteriaKKE?.tahun || undefined));
        }

    }, [kriteriaId, setValue, kriteria_options]);


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
                            Add your variabel KKE by kriteria
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
                                                Its a indikator kinerja?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="kode"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Kode
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    placeholder="e.g. '1.1.1'"
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
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Nama
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled
                                                    placeholder="e.g. '1.1.1'"
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
                                    name="tahun"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Tahun
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    placeholder="e.g. '2023'"
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
                                    name="jenisIsian"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis isian
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled
                                                    placeholder="e.g. 'Yes/No'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                What will you do in this Variabel?
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
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