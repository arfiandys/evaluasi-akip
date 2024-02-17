import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { subKomponenId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const subKomponen = await db.subKomponenLKE.findUnique({
            where: {
              id: params.subKomponenId,
            }
          });
      
          if (!subKomponen) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const kriteriaLKE = await db.kriteriaLKE.create({
            data: {
                subKomponenLKEId: params.subKomponenId,
                ...values
            }
        })

        return NextResponse.json(kriteriaLKE);

    } catch (error) {
        console.log("[KRITERIA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}