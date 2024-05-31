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

        const existingKodePermindok = await db.permindok.findFirst({
            where: {
                AND: [
                    {
                        kode: values.kode,
                    },
                    {
                        evaluasiId: values.evaluasiId
                    }
                ]
            }
        })

        if (existingKodePermindok) {
            return NextResponse.json({ error: "Kode talah digunakan!" });
        }

        const existingNamePermindok = await db.permindok.findFirst({
            where: {
                AND: [
                    {
                        name: values.name,
                    },
                    {
                        evaluasiId: values.evaluasiId
                    }
                ]
            }
        })

        if (existingNamePermindok) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const permindok = await db.permindok.create({
            data: {
                ...values
            }
        })

        return NextResponse.json(permindok);

    } catch (error) {
        console.log("[PERMINDOK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}