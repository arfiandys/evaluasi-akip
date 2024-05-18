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
import { Combobox } from "@/components/ui/combobox";
import { Evaluasi, KelompokKriteriaKKE, Permindok } from "@prisma/client";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    permindokId: z.string().min(1, {
        message: "Permindok id is required",
    }),
    evaluasiId: z.string().min(1, {
        message: "EvaluasiId is required",
    }),
});

interface KelompokKriteriaEditProps {
    permindok_options: { label: string; value: string; data: Permindok }[];
    evaluasi: Evaluasi;
    kelompokKriteria: KelompokKriteriaKKE;
};

const KelompokKriteriaEdit = ({
    permindok_options, evaluasi, kelompokKriteria
}: KelompokKriteriaEditProps) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: kelompokKriteria.kode,
            tahun: evaluasi.tahun,
            name: kelompokKriteria.name,
            permindokId: kelompokKriteria?.permindokId||"",
            evaluasiId: evaluasi.id
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/kke/kelompok-kriteria/${kelompokKriteria.id}`, values);
            toast.success("Kelompok kriteria KKE updated!")
            form.reset()
            router.refresh()
        } catch {
            toast.error("Terdapat kesalahan!");
        }


    }

    return (
        <Card className=" col-span-2">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-8 space-y-4"
                >
                    <CardHeader>
                        <CardTitle>Edit kelompok kriteria</CardTitle>
                        <CardDescription>Edit sebuah kelompok kriteria baru dalam satu kali klik.</CardDescription>
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
                                                placeholder="e.g. 'Kelompok Kriteria harus...'"
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
                                name="permindokId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Permindok
                                        </FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={permindok_options}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Edit Kelompok Kriteria
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default KelompokKriteriaEdit;