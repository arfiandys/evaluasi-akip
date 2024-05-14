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
import { KomponenLKE, KriteriaLKE, SubKomponenLKE, SubKriteriaLKE } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface SubCreateVariabelFormProps {
    subKriteria_options: { label: string; value: string; data: (SubKriteriaLKE & { kriteriaLKE: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null }) | null }); }[];
};

const formSchema = z.object({
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    jenisIsian: z.string().min(1, {
        message: "Name is required",
    }),
    isSubKriteria: z.boolean(),
    subKriteriaLKEId: z.string().min(1, {
        message: "Sub kriteria is required",
    }),
    catatanNegatif: z.string(),
    catatanPositif: z.string(),
    catatanA: z.string(),
    catatanB: z.string(),
    catatanC: z.string(),
});

const SubCreateVariabelPage = (
    {
        subKriteria_options,
    }: SubCreateVariabelFormProps
) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);

    const [selectedJI, setSelectedJI] = useState<string>(
        ""
    )

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            tahun: "",
            jenisIsian: "",
            isSubKriteria: true,
            subKriteriaLKEId: "",
            catatanNegatif: "",
            catatanPositif: "",
            catatanA: "",
            catatanB: "",
            catatanC: "",
        },
        mode: "onChange"
    });

    const { isSubmitting, isValid } = form.formState;
    const { setValue, getValues, watch } = form

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            const response = await axios.post("/api/lke/variabel", values);
            router.push(`/koordinator/lke/variabel/${response.data.id}`);
            toast.success("Variabel created!")
            router.refresh()
        } catch {
            toast.error("Something went wrong!");
        }
    }

    const subKriteriaId = watch("subKriteriaLKEId");
    useEffect(() => {

        if (subKriteriaId) {
            const selectedData = subKriteria_options.find((option) => option.value === subKriteriaId);
            const kodeKomponen = selectedData?.data.kriteriaLKE?.subKomponenLKE?.komponenLKE?.kode || "";
            const kodeSubKomponen = selectedData?.data.kriteriaLKE?.subKomponenLKE?.kode || "";
            const kodeKriteria = selectedData?.data.kriteriaLKE?.kode || "";
            const kodeSubKriteria = selectedData?.data.kode || "";
            const kode = kodeKomponen.concat(".", kodeSubKomponen.concat(".", kodeKriteria.concat(".", kodeSubKriteria)))
            setValue("kode", kode, { shouldValidate: true });
            setValue("tahun", selectedData?.data.kriteriaLKE?.subKomponenLKE?.komponenLKE?.tahun || "", { shouldValidate: true });
        }

    }, [subKriteriaId, setValue, subKriteria_options]);

    const jenisisian = watch("jenisIsian");

    useEffect(() => {
        if (jenisisian) {
            setSelectedJI(jenisisian)
        }
    }, [jenisisian])


    return (
        <div>
            <div className="flex flex-col">
                <div>
                    <h1 className="text-2xl">
                        Tambah variabel LKE by sub kriteria
                    </h1>
                    <p className="text-sm text-secondary-foreground">
                        What would you like to fill your variabel LKE? Don&apos;t worry.
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
                                        <Select
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a isian" />
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
                            <FormField
                                control={form.control}
                                name="subKriteriaLKEId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Sub kriteria
                                        </FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={subKriteria_options}
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
                            {selectedJI === "select" ? (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="catatanNegatif"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Catatan Negatif
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="e.g. 'blablabla...'"
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
                                        name="catatanPositif"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Catatan Positif
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="e.g. 'blablabla...'"
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
                                </>
                            ) : (
                                selectedJI === "dropdown" ? (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="catatanA"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Catatan A
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="e.g. 'blablabla...'"
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
                                            name="catatanB"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Catatan B
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="e.g. 'blablabla...'"
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
                                            name="catatanC"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel>
                                                        Catatan C
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="e.g. 'blablabla...'"
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
                                    </>
                                ) : (
                                    <>
                                    </>
                                )
                            )}
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
        </div>
    );
}

export default SubCreateVariabelPage;