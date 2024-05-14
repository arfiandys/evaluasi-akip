import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluasi = await db.evaluasi.create({
            data: {
                ...values,
            }
        })

        return NextResponse.json(evaluasi);

    } catch (error) {
        console.log("[EVALUASI]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}