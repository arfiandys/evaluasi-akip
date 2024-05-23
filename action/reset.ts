"use server"
import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { ResetSchema } from "@/schemas";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";


export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validateFields = ResetSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Email tidak valid!" }
    }

    const { email } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email tidak ditemukan!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    );

    return { success: "Email atur ulang terkirim!" }

}