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