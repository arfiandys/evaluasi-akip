import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const data = await req.json();
        const name = data.name;
        const email = data.email;
        const password = data.password;
        const role = data.role

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.create({
            data: {
                name,
                email,
                password,
                role,
            }
        })

        return NextResponse.json(user);

    } catch (error) {
        console.log("[UNIT KERJA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}