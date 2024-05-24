import { AccountRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    // role: z.enum([AccountRole.ADMIN, AccountRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
.refine((data) => {
    if (data.password && !data.newPassword) {
        return false;
    }
    return true;
},{
    message: "Password baru dibutuhkan!",
    path: ["newPassword"]
})
.refine((data) => {
    if (data.newPassword && !data.password) {
        return false;
    }
    return true;
},{
    message: "Password dibutuhkan!",
    path: ["password"]
})


export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Diperlukan minimal 6 karakter",
    })
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email dibutuhkan",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email dibutuhkan",
    }),
    password: z.string().min(1, {
        message: "Password dibutuhkan",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email dibutuhkan",
    }),
    password: z.string().min(6, {
        message: "Diperlukan minimal 6 karakter",
    }),
    name: z.string().min(1, {
        message: "Nama dibutuhkan",
    }),
});
