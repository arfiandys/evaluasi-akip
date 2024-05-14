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
import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { Permindok } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
});

interface CreateKelompokKriteriaPageProps {
    permindok_options: { label: string; value: string; data: Permindok }[];
};

const CreateKolompokKriteriaPage = ({
    permindok_options
}: CreateKelompokKriteriaPageProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            tahun: "",
            name: "",
            permindokId: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/kke/kelompok-kriteria", values);
            toast.success("Kelompok kriteria KKE created!")
            form.reset()
            setIsEditing((current) => !current)
            router.refresh()
            router.push(`/koordinator/kke/kelompok-kriteria/${response.data.id}`);
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
                            Add Kelompok Kriteria
                        </>
                    )}
                </Button>
            </div>
            {isEditing && (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Tambah kelompok kriteria
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your Kelompok Kriteria? Don&apos;t worry.
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
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tahun" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
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
                                            <FormDescription>
                                                What will you do in this Permindok?
                                            </FormDescription>
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

export default CreateKolompokKriteriaPage;