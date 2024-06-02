import { currentId } from "@/lib/auth";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { evaluasiId: string } }
) {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluasi = await db.evaluasi.findUnique({
            where: {
                id: params.evaluasiId,
            },
            include: {
                variabelsKKE: true,
                variabelsLKE: true,
                permindoks: true,
                IKUs: true,
            }
        });

        if (!evaluasi) {
            return new NextResponse("Not found", { status: 404 });
        }

        // UPDATE EVALUASI STATUS

        const finishedEvaluasi = await db.evaluasi.update({
            where: {
                id: params.evaluasiId
            },
            data: {
                status: "finish"
            }
        })

        console.log(finishedEvaluasi.status)

        return NextResponse.json(finishedEvaluasi);

    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}