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
import { KomponenLKE, KriteriaLKE, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
});

interface GenerateProps {
    unitKerja: UnitKerja[];
    tahun: {
        value: string;
        label: string;
    }[]
}

// TODO: membenarkan generate LKE

export const GeneratePage = ({
    unitKerja,
    tahun
}: GenerateProps) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;
    const { watch, setValue } = form;
    const tahun_filter = watch("tahun");

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        try {
            unitKerja.map(async (unitkerja) => {
                const value = {
                    unitKerjaId: unitkerja.id,
                    ...values
                }
                try {
                    const response = await axios.post("/api/lke/generate-lke", value);
                    toast.success("Variabel created!")
                    form.reset()
                    router.refresh()
                } catch {
                    toast.error("Something when wrong!");
                }
            })
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
                                            {tahun.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}                                            
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