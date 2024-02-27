import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { sasaranId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const indikatorIKU = await db.indikatorIKU.create({
            data: {
                sasaranIKUId: params.sasaranId,
                ...values,
            }
        })

        return NextResponse.json(indikatorIKU);

    } catch (error) {
        console.log("[INDIKATOR_IKU]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}