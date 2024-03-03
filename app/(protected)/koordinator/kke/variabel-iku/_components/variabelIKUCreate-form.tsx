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
import { IKU, TujuanSasaranIndikatorIKU, VariabelKKE } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CreateVariabelFormProps {
    variabel_options: { label: string; value: string; data: VariabelKKE }[];
    tsi_options: { label: string; value: string; data: TujuanSasaranIndikatorIKU & { IKU: IKU | null }}[];
};

const formSchema = z.object({
    jenisIKU: z.string().min(1, {
        message: "Jenis IKU is required",
    }),
    tujuanSasaranIndikatorIKUId: z.string().min(1, {
        message: "Tujuan/Sasaran/Indikator IKU is required",
    }),
    variabelKKEId: z.string().min(1, {
        message: "Variabel KKE is required",
    }),
});

const CreateVariabelIKUPage = (
    {
        variabel_options,
        tsi_options
    }: CreateVariabelFormProps
) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jenisIKU: "",
            tujuanSasaranIndikatorIKUId: "",
            variabelKKEId: "",
        },
        mode: "onChange"
    });

    const { isSubmitting, isValid } = form.formState;
    const { setValue, getValues, watch } = form

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/kke/variabel-iku", values);
            // router.push(`/koordinator/kke/variabel/${response.data.id}`);
            toast.success("Variabel created!")
            router.refresh()
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const tujuanSasaranIndikatorIKUId = watch("tujuanSasaranIndikatorIKUId");
    useEffect(() => {

        if (tujuanSasaranIndikatorIKUId) {
            const selectedData = tsi_options.find((option) => option.value === tujuanSasaranIndikatorIKUId);
            const jenisIKU = selectedData?.data.IKU?.name || "";
            setValue("jenisIKU", jenisIKU);
        }

    }, [tujuanSasaranIndikatorIKUId, setValue, tsi_options]);


    return (
        <>
            <div className="flex flex-col gap-y-4 ml-auto justify-end my-2">
                <Button onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Variabel KKE IKU
                        </>
                    )}
                </Button>
            </div>
            {isEditing ? (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Add your variabel KKE IKU by kriteria
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your variabel KKE IKU? Don&apos;t worry.
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="mt-8 space-y-4"
                        >
                            <div className="flex flex-row space-x-4 items-start justify-between w-full">
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
                                /> */}
                                <FormField
                                    control={form.control}
                                    name="jenisIKU"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis IKU
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
                                />
                                <FormField
                                    control={form.control}
                                    name="variabelKKEId"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Variabel KKE
                                            </FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={variabel_options}
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
                                    name="tujuanSasaranIndikatorIKUId"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Tujuan/Sasaran/Indikator IKU
                                            </FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={tsi_options}
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

export default CreateVariabelIKUPage;