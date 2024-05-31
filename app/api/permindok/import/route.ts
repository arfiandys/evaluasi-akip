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

        for (const item of values.data) {
            const existingKodePermindok = await db.permindok.findFirst({
                where: {
                    AND: [
                        {
                            kode: item.kode,
                        },
                        {
                            evaluasiId: values.evaluasiId
                        }
                    ]
                }
            })

            const existingNamePermindok = await db.permindok.findFirst({
                where: {
                    AND: [
                        {
                            name: item.name,
                        },
                        {
                            evaluasiId: values.evaluasiId
                        }
                    ]
                }
            })

            if (!existingNamePermindok && !existingKodePermindok) {
                const permindok = await db.permindok.create({
                    data: {
                        kode: item.kode,
                        name: item.name,
                        evaluasiId: values.evaluasiId,
                        tahun: values.tahun
                    }
                })
            }

        }

        return NextResponse.json("Berhasil");

    } catch (error) {
        console.log("[PERMINDOK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}