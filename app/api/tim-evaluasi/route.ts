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

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const timEvaluasi = await db.timEvaluasi.create({
            data: {
                userId,
                name,
            }
        })

        return NextResponse.json(timEvaluasi);

    } catch (error) {
        console.log("[TIM EVALUASI]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}