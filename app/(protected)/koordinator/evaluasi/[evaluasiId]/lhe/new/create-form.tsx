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
import { Evaluasi, KomponenLKE, LKEUnitKerja, UnitKerja, VariabelLKE } from "@prisma/client";
import { useState } from "react";
import { PDF } from "../_component/lhe-pdf";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Activity, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { IconBadge } from "@/components/icon-badge";


const formSchema = z.object({
    nomor: z.string().min(1, {
        message: "Nomor dibutuhkan",
    }),
    kepada: z.string().min(1, {
        message: "Kepada dibutuhkan",
    }),
    dariNama: z.string().min(1, {
        message: "Dari dibutuhkan",
    }),
    tahun: z.string().min(1, {
        message: "Tahun dibutuhkan",
    }),
    evaluasiId: z.string().min(1, {
        message: "Evaluasi id dibutuhkan",
    }),
    unitKerjaId: z.string().min(1, {
        message: "Unit Kerja Id dibutuhkan",
    }),
    tanggal: z.date({
        required_error: "Tanggal dibutuhkan",
    }),
});

interface PermindokNewCreateProps {
    evaluasi: Evaluasi
    unitKerja: UnitKerja[];
    LKEUnitKerja: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[];
}

const Create = ({ evaluasi, unitKerja, LKEUnitKerja }: PermindokNewCreateProps) => {

    type values = {
        nomor: string,
        tahun: string,
        kepada: string,
        dariNama: string,
        evaluasiId: string,
        unitKerjaId: string,
        tanggal: string
    }
    const router = useRouter();
    const [dataObjek, setDataObjek] = useState<values>();
    const [unitId, setUnitId] = useState<string>("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomor: "",
            tahun: evaluasi.tahun,
            kepada: "",
            dariNama: "",
            evaluasiId: evaluasi.id,
            unitKerjaId: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setUnitId(values.unitKerjaId)
            const value = {
                ...values,
                tanggal: format(values.tanggal, "PPP")
            }
            setDataObjek(value)
            toast.success("LHE berhasil dibuat")
        } catch {
            toast.error("Terdapat kesalahan!");
        }
        // router.refresh()
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
                                name="nomor"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Nomor
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'R-0119/08300/PW.120/02/2023...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="kepada"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Kepada
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Inspektur Wilayah 1...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dariNama"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Dari
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Arfiandys...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unitKerjaId"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Unit Kerja</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih unit kerja" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {unitKerja.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tanggal"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Tanggal</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pilih tanggal</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end items-center gap-4">
                        <Button
                            size="sm"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Buat LHE
                        </Button>
                        <PDF dataObjek={dataObjek} unitKerjaId={unitId} LKEUnitKerja={LKEUnitKerja} unitKerja={unitKerja} />
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default Create;