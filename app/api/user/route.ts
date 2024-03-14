import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        const hashedPassword = await bcrypt.hash(values.password, 10);

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.create({
            data: {
                name: values.name,
                email: values.email,
                password: hashedPassword

            }
        })

        return NextResponse.json(user);

    } catch (error) {
        console.log("[PENGGUNA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}