import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(values.password, 10);
        
        const existingUser = await getUserByEmail(values.email);
        
        if (existingUser) {
            return NextResponse.json({ error: "Email talah digunakan!" });
        }

        const user = await db.user.create({
            data: {
                name: values.name,
                email: values.email,
                password: hashedPassword

            }
        })
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return NextResponse.json({success: "Konfirmasi email terkirim!"});

    } catch (error) {
        console.log("[PENGGUNA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}