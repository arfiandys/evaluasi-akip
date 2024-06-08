"use client"
import * as z from "zod";

import { CardWrapper } from "@/components/auth/card-wrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
 } from "@/components/ui/form"
import { useSearchParams } from "next/navigation";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/action/login";
import { useState, useTransition } from "react";
import Link from "next/link";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email sudah digunakan pada provider yang berbeda!"
        : "";

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values)
            // login(values, callbackUrl)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
        })
    }

    return (
        <CardWrapper 
        headerLabel="Selamat datang"
        backButtonLabel={null}
        backButtonHref={null}
        // showSocial
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder="jhon.doe@example.com"
                                    type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                    {...field}
                                    disabled={isPending}
                                    placeholder="******"
                                    type="password"
                                    />
                                </FormControl>
                                <Button 
                                size="sm"
                                variant="link"
                                asChild
                                className="px-0 font-normal">
                                    <Link href="/auth/reset">
                                        Lupa password?
                                    </Link>
                                </Button>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full"
                    >
                        Masuk
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}