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
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingTimEvaluasi = await db.timEvaluasi.findUnique({
            where: {
                name: name
            }
        })

        if (existingTimEvaluasi) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const timEvaluasi = await db.timEvaluasi.create({
            data: {
                name,
            }
        })

        return NextResponse.json(timEvaluasi);

    } catch (error) {
        console.log("[TIM EVALUASI]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}