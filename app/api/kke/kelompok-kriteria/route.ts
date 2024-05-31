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

        const existingKodeKelompok = await db.kelompokKriteriaKKE.findFirst({
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

        if (existingKodeKelompok) {
            return NextResponse.json({ error: "Kode talah digunakan!" });
        }

        const existingNameKelompok = await db.kelompokKriteriaKKE.findFirst({
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

        if (existingNameKelompok) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const kelompokKriteria = await db.kelompokKriteriaKKE.create({
            data: {
                ...values,
            }
        })

        return NextResponse.json(kelompokKriteria);

    } catch (error) {
        console.log("[KELOMPOK_KRITERIA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}