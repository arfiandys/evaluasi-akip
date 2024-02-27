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

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    kode: z.string().min(1, {
        message: "Kode is required",
    }),
});

interface CreateTujuanIKUPageProps {
    IKUId: string;
  };

const CreateTujuanIKUPage = ({
    IKUId,
  }: CreateTujuanIKUPageProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            kode: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`/api/iku/${IKUId}/tujuan`, values);
            toast.success("Tujuan IKU created!")
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
                            Add Tujuan IKU
                        </>
                    )}
                </Button>
            </div>
            {isEditing && (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-2xl">
                            Add your tujuan IKU
                        </h1>
                        <p className="text-sm text-secondary-foreground">
                            What would you like to fill your tujuan IKU? Don&apos;t worry.
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
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    disabled={isSubmitting}
                                                    placeholder="e.g. 'Tujuan IKU unit kerja...'"
                                                    {...field}
                                                />
                                            </FormControl>
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

export default CreateTujuanIKUPage;