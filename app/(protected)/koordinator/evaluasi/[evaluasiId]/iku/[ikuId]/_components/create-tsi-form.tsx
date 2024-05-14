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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    nama: z.string().min(1, {
        message: "Name is required",
    }),
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
    jenis: z.string().min(1, {
        message: "Jenis is required",
    }),
});

interface CreateTujuanSasaranIndikatorIKUProps {
    IKUId: string;
  };

const CreateTujuanSasaranIndikatorIKUPage = ({
    IKUId,
  }: CreateTujuanSasaranIndikatorIKUProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: "",
            kode: "",
            jenis: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`/api/iku/${IKUId}/tujuanSasaranIndikator`, values);
            toast.success("Tujuan/Sasaran/Indikator IKU created!")
            form.reset()
            setIsEditing((current) => !current)
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
                            Add Tujuan/Sasaran/Indikator IKU
                        </>
                    )}
                </Button>
            </div>
            {isEditing && (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Tambah Tujuan/Sasaran/Indikator IKU
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your Tujuan/Sasaran/Indikator IKU? Don&apos;t worry.
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
                                    name="nama"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Nama
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'Tujuan IKU unit kerja...'"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jenis"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Jenis
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
                                                    <SelectItem value="tujuan">
                                                        Tujuan
                                                    </SelectItem>
                                                    <SelectItem value="sasaran">
                                                        Sasaran
                                                    </SelectItem>
                                                    <SelectItem value="indikator">
                                                        Indikator
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

export default CreateTujuanSasaranIndikatorIKUPage;