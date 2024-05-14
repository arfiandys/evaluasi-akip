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
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    kodeWilayah: z.string().min(1, {
        message: "Kode wilayah is required",
    }),
    kodeUnitKerja: z.string().min(1, {
        message: "Kame unit kerja is required",
    }),
    jenisUnitKerja: z.string().min(1, {
        message: "Jenis unit kerja is required",
    }),
});


const CreateUnitKerjaPage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            kodeWilayah: "",
            kodeUnitKerja: "",
            jenisUnitKerja: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/unit-kerja", values);
            router.push(`/koordinator/unit-kerja/${response.data.id}`);
            toast.success("Unit Kerja created!")
            router.refresh()
        } catch {
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="">
            <div className="flex justify-end my-4">
                <Button onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add unit kerja
                        </>
                    )}
                </Button>
            </div>
            {isEditing && (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Tambah unit kerja
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your unit kerja? Don&apos;t worry.
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Nama
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'Unit one'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kodeUnitKerja"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Kode unit kerja
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. '0000'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="kodeWilayah"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Kode wilayah
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. '00'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jenisUnitKerja"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis unit kerja
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
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                >
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}

export default CreateUnitKerjaPage;