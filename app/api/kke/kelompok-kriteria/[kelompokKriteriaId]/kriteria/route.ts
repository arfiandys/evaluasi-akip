import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { kelompokKriteriaId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
            where: {
              id: params.kelompokKriteriaId,
            }
          });
      
          if (!kelompokKriteria) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const kriteriaKKE = await db.kriteriaKKE.create({
            data: {
                kelompokKriteriaKKEId: params.kelompokKriteriaId,
                ...values
            }
        })

        return NextResponse.json(kriteriaKKE);

    } catch (error) {
        console.log("[KRITERIA_KKE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}