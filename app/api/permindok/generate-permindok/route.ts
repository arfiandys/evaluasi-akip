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


        if (values.data && values.unitKerjaId!) {
            const assignPermindok = await db.unitKerja.update({
                where: {
                    id: values.unitKerjaId
                },
                data: {
                    permindoks: {
                        create: values.data
                    }
                }
            })

            return NextResponse.json(assignPermindok);
        }


    } catch (error) {
        console.log("[PERMINDOK]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}