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
import { IconBadge } from "@/components/icon-badge";
import { Activity } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nama dibutuhkan",
    }),
});

const UserNewCreate = () => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/tim-evaluasi", values);
            if (response.data.error) {
                toast.error(response.data.error)
            } else {
                router.push(`/koordinator/tim-evaluasi/${response.data.id}`);
                toast.success("Tim evaluasi berhasil dibuat!")
            }
            form.reset()
            router.refresh()
        } catch {
            toast.error("Terdapat kesalahan!");
        }


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
                                name="name"
                                render={({ field }) => (
                                    <FormItem className=" w-full">
                                        <FormLabel>
                                            Nama
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Tim evaluasi 1'"
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
                            disabled={isSubmitting}
                        >
                            Buat Tim Evaluasi
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default UserNewCreate;