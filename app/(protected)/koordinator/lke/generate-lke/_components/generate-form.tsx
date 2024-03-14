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
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KriteriaLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    data: z.object({
        tahun: z.string().min(1),
        jenisIsian: z.string().min(1),
        variabelLKE: z.object({
            connect: z.object({
                id: z.string().min(1),
            }),
        }),
    }).array(),
});

interface GenerateProps {
    variabelLKE: (VariabelLKE & { kriteriaLKE: KriteriaLKE | null; subKriteriaLKE: SubKriteriaLKE | null })[];
    unitKerja: UnitKerja[];

}

export const GeneratePage = ({
    variabelLKE,
    unitKerja
}: GenerateProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: "",
            data: undefined
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const { watch, setValue } = form;
    const tahun_filter = watch("tahun");



    useEffect(() => {
        const variabel_filtered = variabelLKE.filter(function (variabel) {
            return variabel.tahun === tahun_filter;
        }).map(function (variabel) { return variabel })

        const data = Array.from(variabel_filtered).map((variabel) => ({
            tahun: variabel.tahun,
            jenisIsian: variabel.jenisIsian,
            variabelLKE: {
                connect: {
                    id: variabel.id
                }
            }
        }))

        setValue("data", data)

    }, [tahun_filter, setValue, variabelLKE]);



    const onSubmit = (values: z.infer<typeof formSchema>) => {
        try {
            unitKerja.map(async (unitkerja) => {
                const value = {
                    data: values.data,
                    unitKerjaId: unitkerja.id
                }
                try {
                    const response = await axios.post("/api/lke/generate-lke", value);
                    toast.success("Variabel created!")
                } catch {
                    toast.error("Something when wrong!");
                }
            })
            form.reset()
            router.push(`/koordinator/lke/generate-lke`);
            router.refresh()
        } catch {
            toast.error("Can not generate LKE!");
        }
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 justify-between items-start h-full p-6">

            <div className="w-full col-span-2">
                <h1 className="text-2xl">
                    Generate LKE unit kerja
                </h1>
                <p className="text-sm text-secondary-foreground">
                    What would you like to generate your LKE? Don&apos;t worry.
                </p>
            </div>
            <div className="w-full">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="tahun"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Tahun
                                    </FormLabel>
                                    <Select
                                        disabled={isSubmitting}
                                        onValueChange={field.onChange}
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
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        What will you do in this Variabel?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2 justify-start md:justify-end">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Generate
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}