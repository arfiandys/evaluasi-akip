import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { kriteriaId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const kriteria = await db.kriteriaLKE.findUnique({
            where: {
              id: params.kriteriaId,
            }
          });
      
          if (!kriteria) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const subKriteriaLKE = await db.subKriteriaLKE.create({
            data: {
                kriteriaLKEId: params.kriteriaId,
                ...values
            }
        })

        return NextResponse.json(subKriteriaLKE);

    } catch (error) {
        console.log("[SUB_KRITERIA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}