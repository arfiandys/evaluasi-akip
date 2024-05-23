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

        const existingNamaUnitKerja = await db.unitKerja.findUnique({
            where: {
                name: values.name,
            }
        })

        if (existingNamaUnitKerja) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const existingKodeUnitKerja = await db.unitKerja.findUnique({
            where: {
                kodeUnitKerja: values.kodeUnitKerja,
            }
        })

        if (existingKodeUnitKerja) {
            return NextResponse.json({ error: "Kode unit kerja talah digunakan!" });
        }

        const unitKerja = await db.unitKerja.create({
            data: {
                ...values
            }

        })

        return NextResponse.json(unitKerja);

    } catch (error) {
        console.log("[UNIT KERJA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}