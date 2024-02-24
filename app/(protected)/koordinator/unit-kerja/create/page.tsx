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
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            kodeWilayah: "",
            kodeUnitKerja: "",
        },
    });

    const { isSubmitting, isValid} = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/unit-kerja", values);
            router.push(`/koordinator/unit-kerja/${response.data.id}`);
            toast.success("Unit Kerja created!")
        } catch {
            toast.error("Something went wrong!");  
        }
    }

    return ( 
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">
                    Name your unit kerja
                </h1>
                <p className="text-sm text-secondary-foreground">
                    What would you like to name your team? Don&apos;t worry. 
                </p>
                <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-8"
                    >
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Unit kerja name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'Unit one'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What will you do in this unit kerja?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="kodeWilayah"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Kode wilayah
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g. '3524'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What the kode wilayah of this unit kerja?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="kodeUnitKerja"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Kode unit kerja
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    disabled={isSubmitting}
                                    placeholder="e.g. '0011'"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    What the kode unit kerja of this unit kerja?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/koordinator/unit-kerja/">
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