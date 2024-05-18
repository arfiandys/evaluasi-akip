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
import { Evaluasi, KomponenLKE } from "@prisma/client";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
    bobot: z.coerce.number({
        required_error: "Bobot is required",
        invalid_type_error: "Bobot must be a number",
    }),
});

interface KomponenEditProps {
    evaluasi: Evaluasi,
    komponenLKE: KomponenLKE
}

const KomponenEdit = ({ evaluasi, komponenLKE }: KomponenEditProps) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: komponenLKE.kode,
            name: komponenLKE.name,
            bobot: komponenLKE.bobot,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/lke/komponen/${komponenLKE.id}`, values);
            toast.success("Komponen LKE diupdate!")
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
                        <CardTitle>Edit komponen</CardTitle>
                        <CardDescription>Edit sebuah komponen baru dalam satu kali klik.</CardDescription>
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
                                                placeholder="e.g. 'Komponen harus...'"
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
                                                disabled
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
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Edit Komponen
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default KomponenEdit;