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
        const kodeWilayah = data.kodeWilayah;
        const kodeUnitKerja = data.kodeUnitKerja;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unitKerja = await db.unitKerja.create({
            data: {
                userId,
                name,
                kodeWilayah,
                kodeUnitKerja,
            }
        })

        return NextResponse.json(unitKerja);

    } catch (error) {
        console.log("[UNIT KERJA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}