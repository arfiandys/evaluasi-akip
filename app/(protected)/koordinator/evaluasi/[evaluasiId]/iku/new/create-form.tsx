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
import { Evaluasi, Permindok } from "@prisma/client";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    evaluasiId: z.string().min(1, {
        message: "EvaluasiId is required",
    }),
});

interface IKUNewCreateProps {
    evaluasi: Evaluasi;
};

const IKUNewCreate = ({
    evaluasi
}: IKUNewCreateProps) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tahun: evaluasi.tahun,
            name: "",
            evaluasiId: evaluasi.id
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/iku", values);
            toast.success("IKU created!")
            form.reset()
            router.refresh()
            router.push(`/koordinator/evaluasi/${evaluasi.id}/iku/${response.data.id}`);
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
                        <CardTitle>Buat IKU</CardTitle>
                        <CardDescription>Terapkan sebuah IKU baru dalam satu kali klik.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4 items-start justify-between w-full">
                            {/* <FormField
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
                                                placeholder="e.g. 'Unit kerja kabupaten/kota...'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Nama
                                        </FormLabel>
                                        <Select
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih isian" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="kab/kota">
                                                    Kabupaten/Kota
                                                </SelectItem>
                                                <SelectItem value="provinsi">
                                                    Provinsi
                                                </SelectItem>
                                                <SelectItem value="pusat">
                                                    Pusat
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
                            disabled={!isValid || isSubmitting}
                        >
                            Buat IKU
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default IKUNewCreate;