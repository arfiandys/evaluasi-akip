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

        interface PesanError {
            error: string;
            konten: string;
        }

        const jsonString = `[]`;

        // Parse the JSON string into an array of objects
        let arrayError: PesanError[] = JSON.parse(jsonString);

        for (const item of values.data) {
            const existingNamaTSI = await db.tujuanSasaranIndikatorIKU.findFirst({
                where: {
                    AND: [
                        {
                            nama: item.nama
                        },
                        {
                            IKUId: params.ikuId
                        }
                    ]
                }
            })
            if (!existingNamaTSI) {
                const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.create({
                    data: {
                        IKUId: params.ikuId,
                        kode: item.kode,
                        nama: item.nama,
                        jenis: item.jenis
                    }
                })
            } else {
                arrayError.push({ error: "nama tujuan Sasaran IndikatorIKU sudah digunakan", konten: item.nama });
            }
        }

        return NextResponse.json({ return: arrayError });


    } catch (error) {
        console.log("[TUJUAN/SASARAN?INDIKATOR_IKU]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}