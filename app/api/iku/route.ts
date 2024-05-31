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

        const existingNameIKU = await db.iKU.findFirst({
            where: {
                AND: [
                    {
                        name: values.name
                    },
                    {
                        evaluasiId: values.evaluasiId
                    }
                ]
            }
        })

        if (existingNameIKU) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const IKU = await db.iKU.create({
            data: {
                ...values,
            }
        })

        return NextResponse.json(IKU);

    } catch (error) {
        console.log("[IKU]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}