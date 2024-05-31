import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { ikuId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingKodeTSI = await db.tujuanSasaranIndikatorIKU.findFirst({
            where: {
                AND: [
                    {
                        kode: values.kode,
                    },
                    {
                        IKUId: params.ikuId
                    }
                ]
            }
        })

        if (existingKodeTSI) {
            return NextResponse.json({ error: "Kode talah digunakan!" });
        }

        const existingNameTSI = await db.tujuanSasaranIndikatorIKU.findFirst({
            where: {
                AND: [
                    {
                        nama: values.nama,
                    },
                    {
                        IKUId: params.ikuId
                    }
                ]
            }
        })

        if (existingNameTSI) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.create({
            data: {
                IKUId: params.ikuId,
                ...values,
            }
        })

        return NextResponse.json(tujuanSasaranIndikatorIKU);

    } catch (error) {
        console.log("[TUJUAN/SASARAN?INDIKATOR_IKU]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}