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
import { Evaluasi } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
import { Activity } from "lucide-react";


const formSchema = z.object({
    title: z.string().min(1, {
        message: "Name dibutuhkan",
    }),
    description: z.string().min(1, {
        message: "Kode dibutuhkan",
    }),
    tahun: z.string().min(1, {
        message: "Tahun dibutuhkan",
    })
});

interface Props {
    evaluasi: Evaluasi
}

const EvaluasiEdit = ({ evaluasi }: Props) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: evaluasi.description || "",
            tahun: evaluasi.tahun,
            title: evaluasi.title,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/evaluasi/${evaluasi.id}`, values);
            toast.success("Evaluasi berhasil diperbarui!")
            form.reset()
            router.refresh()
            router.push(`/koordinator/evaluasi/${evaluasi.id}`);
        } catch {
            toast.error("Terdapat kesalahan!");
        }


    }

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
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Nama
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Evaluasi 1...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Deskripsi
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Evalausi harus...'"
                                                {...field}
                                            />
                                        </FormControl>
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
                                        <Select
                                            disabled
                                            onValueChange={field.onChange}
                                            defaultValue={evaluasi.tahun}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tahun" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="2022">
                                                    2022
                                                </SelectItem>
                                                <SelectItem value="2023">
                                                    2023
                                                </SelectItem>
                                                <SelectItem value="2024">
                                                    2024
                                                </SelectItem>
                                                <SelectItem value="2025">
                                                    2025
                                                </SelectItem>
                                                <SelectItem value="2026">
                                                    2026
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Edit Evaluasi
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default EvaluasiEdit;