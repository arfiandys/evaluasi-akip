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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { Evaluasi, IKU, KriteriaKKE, TujuanSasaranIndikatorIKU, TujuanSasaranIndikatorIKUVariabelKKE, VariabelKKE, VariabelLKE } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IconBadge } from "@/components/icon-badge";
import { Activity } from "lucide-react";


const formSchema = z.object({
    nama: z.string().min(1, {
        message: "Nama dibutuhkan",
    }),
    kode: z.string().min(1, {
        message: "Kode dibutuhkan",
    }),
    evaluasiId: z.string().min(1, {
        message: "Evaluasi id dibutuhkan",
    }),
    jenisIsian: z.string().min(1, {
        message: "Jenis isian dibutuhkan",
    }),
    jenisIsianIKU: z.string().min(1, {
        message: "Jenis isian IKU dibutuhkan",
    }),
    isIndikatorKinerja: z.string().min(1),
    petunjukEvaluasi: z.string(),
    variabelLKEId: z.string().min(1, {
        message: "Variabel LKE dibutuhkan",
    }),
    items: z.array(z.string())
    // .refine((value) => value.some((item) => item), {
    //     message: "You have to select at least one item.",
    // }),
});

interface EditProps {
    kelompokKriteriaId: string;
    evaluasi: Evaluasi;
    variabelLKE_options_ED: { label: string; value: string; data: VariabelLKE }[];
    variabelLKE_options_IK: { label: string; value: string; data: VariabelLKE }[];
    IKU_options: { label: string; value: string; data: IKU & { tujuanSasaranIndikatorIKU: TujuanSasaranIndikatorIKU[] } }[];
    kriteria: (KriteriaKKE & {variabelKKE: (VariabelKKE & {tujuanSasaranIndikatorIKUVariabelKKE: TujuanSasaranIndikatorIKUVariabelKKE[]})|null});
};

const KriteriaEdit = ({
    kelompokKriteriaId, evaluasi, variabelLKE_options_IK, variabelLKE_options_ED, IKU_options, kriteria
}: EditProps) => {

    const itemIKU = kriteria.variabelKKE?.tujuanSasaranIndikatorIKUVariabelKKE.map((x)=>{
        return x.tujuanSasaranIndikatorIKUId
    })

    const [selectedJKK, setSelectedJKK] = useState<string>(
        "false"
    )
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: kriteria.kode,
            nama: kriteria.nama,
            evaluasiId: evaluasi.id,
            jenisIsian: kriteria.variabelKKE!.jenisIsian,
            isIndikatorKinerja: (kriteria.variabelKKE!.isIndikatorKinerja)?"true":"false",
            jenisIsianIKU: kriteria.variabelKKE!.jenisIsianIKU||"-_-",
            petunjukEvaluasi: kriteria.variabelKKE!.petunjukEvaluasi||"",
            variabelLKEId: kriteria.variabelKKE!.variabelLKEId,
            items: itemIKU
        },
    });

    const { setValue, getValues, watch, resetField, reset } = form

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const value = {
            ...values,
            jenisIsianIKU: (values.jenisIsianIKU === "-_-") ? null : values.jenisIsianIKU,
            isIndikatorKinerja: (values.isIndikatorKinerja === "true")
        }
        // toast.success(<pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-auto">
        //     <code className="text-white">{JSON.stringify(value, null, 2)}</code>
        // </pre>)
        try {
            const response = await axios.patch(`/api/kke/kelompok-kriteria/${kelompokKriteriaId}/kriteria/${kriteria.id}`, value);
            toast.success("Kriteria KKE berhasil diperbarui!")
            router.refresh()
            reset()
        } catch {
            toast.error("Terdapat kesalahan!");
        }
    }

    const variabelId = watch("variabelLKEId");

    useEffect(() => {

        if (variabelId) {
            const selectedData = variabelLKE_options_ED.find((option) => option.value === variabelId);
            const kodeVariabel = selectedData?.data.kode || "";
            const jenisIsianVariabel = selectedData?.data.jenisIsian || "";
            setValue("kode", kodeVariabel, { shouldValidate: true });
            if (getValues("isIndikatorKinerja") === "false") {
                setValue("jenisIsian", jenisIsianVariabel, { shouldValidate: true });
            }
        }

    }, [variabelId, getValues, setValue, variabelLKE_options_ED]);

    const jenisKK = watch("isIndikatorKinerja");

    useEffect(() => {
        if (jenisKK) {
            setSelectedJKK(jenisKK)
            resetField("jenisIsian")
            resetField("jenisIsianIKU")
            if (jenisKK === "true") {
                setValue("jenisIsianIKU", "select");
                setValue("jenisIsian", "number");
                const selectedData = variabelLKE_options_IK.find((option) => option.value === kriteria.variabelKKE!.variabelLKEId);
                if (!selectedData) {
                    setValue("variabelLKEId","")
                }
            }
            if (jenisKK === "false") {
                setValue("jenisIsianIKU", "-_-");
                setValue("items",[])
            }
        }
    }, [jenisKK, resetField, setValue, variabelLKE_options_IK, kriteria.variabelKKE])

    return (
        <Card className="shadow-lg col-span-4 md:col-start-2 md:col-span-2 rounded-3xl h-fit">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                        <div className="flex flex-row gap-x-4 justify-start items-center">
                            <IconBadge icon={Activity} />
                            <CardTitle>Rincian dasar</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4 items-start justify-between w-full">
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
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Kriteria harus...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isIndikatorKinerja"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Jenis kertas kerja
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={(kriteria.variabelKKE!.isIndikatorKinerja)?"true":"false"}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih isian" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="false">KK Evaluasi Dokumen</SelectItem>
                                                <SelectItem value="true">KK Indikator Kinerja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(selectedJKK === "true") ? (
                                <FormField
                                    control={form.control}
                                    name="jenisIsianIKU"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis isian IKU
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={kriteria.variabelKKE!.jenisIsianIKU||"-_-"}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih isian" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="select">
                                                        Select Ya / Tidak
                                                    </SelectItem>
                                                    {/* <SelectItem value="dropdown">
                                                        Dropdown A/B/C
                                                    </SelectItem>
                                                    <SelectItem value="number">
                                                        Number
                                                    </SelectItem> */}
                                                </SelectContent>
                                            </Select>
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
                                                options={(selectedJKK === "true") ? variabelLKE_options_IK : variabelLKE_options_ED}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(selectedJKK === "true") ? (
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem className="w-full">
                                            <FormLabel>Tujuan/Sasaran/Indikator</FormLabel>
                                            <div className="border rounded-md w-full p-4">
                                                {IKU_options.map((item) => (
                                                    <div
                                                        key={item.value}
                                                    >
                                                        <div className="mb-4">
                                                            <FormLabel>{item.label}</FormLabel>
                                                            <FormDescription>
                                                                Pilih tujuan/sasaran/indikator pada jenis IKU {item.label}
                                                            </FormDescription>
                                                        </div>
                                                        <div className="border rounded-md mb-4 p-4">
                                                            {item.data.tujuanSasaranIndikatorIKU.map((item) => (
                                                                <FormField
                                                                    key={item.id}
                                                                    control={form.control}
                                                                    name="items"
                                                                    render={({ field }) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={item.id}
                                                                                className="flex flex-row items-start space-x-3 space-y-0 my-4"
                                                                            >
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(item.id)}
                                                                                        onCheckedChange={(checked) => {
                                                                                            return checked
                                                                                                ? field.onChange([...field.value, item.id])
                                                                                                : field.onChange(
                                                                                                    field.value?.filter(
                                                                                                        (value) => value !== item.id
                                                                                                    )
                                                                                                )
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {item.kode} | {item.nama}
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        )
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <>

                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Edit Kriteria
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default KriteriaEdit;