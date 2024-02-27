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

interface CreateVariabelFormProps {
    kriteria_options: { label: string; value: string; data: (KriteriaLKE & { subKomponenLKE: (SubKomponenLKE & { komponenLKE: KomponenLKE | null }) | null }); }[];
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
    kriteriaLKEId: z.string().min(1, {
        message: "Kriteria is required",
    }),
});

const CreateVariabelPage = (
    {
        kriteria_options,
    }: CreateVariabelFormProps
) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            tahun: "",
            jenisIsian: "",
            isSubKriteria: false,
            kriteriaLKEId: "",
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

    const kriteriaId = watch("kriteriaLKEId");
    useEffect(() => {

        if (kriteriaId) {
            const selectedData = kriteria_options.find((option) => option.value === kriteriaId);
            const kodeKomponen = selectedData?.data.subKomponenLKE?.komponenLKE?.kode || "";
            const kodeSubKomponen = selectedData?.data.subKomponenLKE?.kode || "";
            const kodeKriteria = selectedData?.data.kode || "";
            const kode = kodeKomponen.concat(".", kodeSubKomponen.concat(".", kodeKriteria));
            setValue("kode", kode);
            setValue("tahun", selectedData?.data.subKomponenLKE?.komponenLKE?.tahun || "");
        }

    }, [kriteriaId, setValue, kriteria_options]);


    return (
        <div>
            <div className="flex flex-col">
                <div>
                    <h1 className="text-2xl">
                        Add your variabel LKE by kriteria
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
                                            Variabel kode
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
                                            Variabel tahun
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
                                            Variabel jenis isian
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
                                name="kriteriaLKEId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Variabel kriteria
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

export default CreateVariabelPage;