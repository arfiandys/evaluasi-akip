import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.PIMPINAN, UserRole.PIC, UserRole.DALNIS, UserRole.KETUA, UserRole.ANGGOTA]),
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
    message: "New password is required!",
    path: ["newPassword"]
})
.refine((data) => {
    if (data.newPassword && !data.password) {
        return false;
    }
    return true;
},{
    message: "Password is required!",
    path: ["password"]
})


export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minumim of 6 characters required",
    })
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 character required",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
});
