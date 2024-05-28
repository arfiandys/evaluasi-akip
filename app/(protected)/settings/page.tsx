"use client"

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useTransition, useState } from "react";

import { SettingsSchema } from "@/schemas";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AccountRole } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const SettingPage = () => {

    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const router = useRouter();

    const { update } = useSession();


    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: user?.name || undefined,
            email: user?.email || undefined,
        }
    })
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
        try {
            await axios.patch(`/api/settings`, values);
            toast.success("Pengguna berhasil diperbarui");
            form.reset()
            router.refresh();
          } catch {
            toast.error("Terdapat kesalahan");
          }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-[600px] mx-4 shadow-lg rounded-3xl">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">
                        Profil
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Nama
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Jhon Doe"
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {user?.isOAuth === false && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="jhon.doe@example.com"
                                                            type="email"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="******"
                                                            type="password"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Password baru
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="******"
                                                            type="password"
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button disabled={isSubmitting } type="submit">
                                Simpan
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default SettingPage;