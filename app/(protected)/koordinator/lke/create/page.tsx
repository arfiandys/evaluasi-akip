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
import Link from "next/link";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    kode: z.string().min(1, {
        message: "Tahun is required",
    }),
    tahun: z.string().min(1, {
        message: "Tahun is required",
    }),
    jenisIsian: z.string().min(1, {
        message: "Tahun is required",
    }),
    isSubKriteria: z.boolean({
        required_error: "isActive is required",
        invalid_type_error: "isActive must be a boolean",
    }),
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            kode: "",
            tahun: "",
            jenisIsian: "",
            isSubKriteria: true,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/lke", values);
            router.push(`/koordinator/lke/${response.data.id}`);
            toast.success("LKE created!")
        } catch {
            toast.error("Something went wrong!");
        }


    }

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your LKE
                </h1>
                <p className="text-sm text-secondary-foreground">
                    What would you like to name your LKE? Don&apos;t worry.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="kode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        LKE kode
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. '1.1.1'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you do in this LKE?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tahun"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        LKE tahun
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. '2023'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you do in this LKE?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jenisIsian"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        LKE jenis isian
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'select'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        What will you do in this LKE?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isSubKriteria"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        LKE jenis isian
                                    </FormLabel>
                                    <FormControl>
                                        <Checkbox className="ml-2"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    {/* <Select
                                        disabled={isSubmitting}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a is sub kriteria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={true}>
                                                Ya
                                            </SelectItem>
                                            <SelectItem value={false}>
                                                Tidak
                                            </SelectItem>
                                        </SelectContent>
                                    </Select> */}

                                    <FormDescription>
                                        What will you do in this LKE?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                            </Link>
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
        </div>
    );
}

export default CreatePage;