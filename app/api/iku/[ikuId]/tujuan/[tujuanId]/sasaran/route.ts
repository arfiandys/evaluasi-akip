import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { tujuanId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const sasaranIKU = await db.sasaranIKU.create({
            data: {
                tujuanIKUId: params.tujuanId,
                ...values,
            }
        })

        return NextResponse.json(sasaranIKU);

    } catch (error) {
        console.log("[SASARAN_IKU]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}