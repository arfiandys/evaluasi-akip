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
import { Evaluasi, KriteriaLKE, VariabelLKE } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
import { Activity } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nama dibutuhkan",
    }),
    kode: z.string().min(1, {
        message: "Kode dibutuhkan",
    }),
    bobot: z.coerce.number({
        required_error: "Bobot dibutuhkan",
        invalid_type_error: "Bobot harus angka",
    }),
    jenisIsian: z.string().min(1, {
        message: "Jenis isian dibutuhkan",
    }),
    levelVariabel: z.string().min(1, {
        message: "Level variabel dibutuhkan",
    }),
    catatanNegatif: z.string(),
    catatanPositif: z.string(),
    catatanA: z.string(),
    catatanB: z.string(),
    catatanC: z.string(),
    evaluasiId: z.string().min(1, {
        message: "Evaluasi id dibutuhkan",
    }),
});

interface CreateProps {
    evaluasi: Evaluasi
    komponenId: string;
    subKomponenId: string;
    kriteriaId: string;
    kriteria: KriteriaLKE & { variabelLKE: VariabelLKE | null };
};

const SubKriteriaNewCreate = ({
    evaluasi, komponenId, subKomponenId, kriteriaId, kriteria
}: CreateProps) => {

    const [selectedJI, setSelectedJI] = useState<string>("")
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            name: "",
            bobot: undefined,
            jenisIsian: "",
            levelVariabel: "subKriteria",
            catatanNegatif: "",
            catatanPositif: "",
            catatanA: "",
            catatanB: "",
            catatanC: "",
            evaluasiId: evaluasi.id
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (kriteria.variabelLKE?.jenisIsian !== "number") {
            toast.error("Sub Kriteria LKE tidak dapat dibuat karena jenis isian kriteria tidak number!")
        } else {
            try {
                const response = await axios.post(`/api/lke/komponen/${komponenId}/subKomponen/${subKomponenId}/kriteria/${kriteriaId}/subKriteria`, values);
                if (response.data.error) {
                    toast.error(response.data.error)
                } else {
                    toast.success("Sub Kriteria LKE berhasil dibuat!")
                    router.push(`/koordinator/evaluasi/${evaluasi.id}/lke/komponen/${komponenId}/subKomponen/${subKomponenId}/kriteria/${kriteriaId}`);
                    form.reset()
                    router.refresh()
                }
            } catch {
                toast.error("Terdapat kesalahan!");
            }
        }
    }

    const jenisisian = form.watch("jenisIsian");

    useEffect(() => {
        if (jenisisian) {
            setSelectedJI(jenisisian)
        }
    }, [jenisisian])

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
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Nama
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Sub kriteria harus...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                                disabled={isSubmitting}
                                                placeholder="e.g. '1'"
                                                type="number"
                                                min={0}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bobot"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Bobot nilai
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. '0.5'"
                                                type="number"
                                                step={0.01}
                                                min={0}
                                                max={1}
                                                {...field}
                                            />
                                        </FormControl>
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
                                                    Select Ya / Tidak
                                                </SelectItem>
                                                <SelectItem value="dropdown">
                                                    Dropdown A/B/C
                                                </SelectItem>
                                                <SelectItem value="number">
                                                    Number
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Buat Sub Kriteria
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default SubKriteriaNewCreate;