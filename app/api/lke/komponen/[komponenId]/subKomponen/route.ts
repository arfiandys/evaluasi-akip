import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { komponenId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const komponen = await db.komponenLKE.findUnique({
            where: {
              id: params.komponenId,
            }
          });
      
          if (!komponen) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const subKomponenLKE = await db.subKomponenLKE.create({
            data: {
                komponenLKEId: params.komponenId,
                ...values
            }
        })

        return NextResponse.json(subKomponenLKE);

    } catch (error) {
        console.log("[SUB_KOMPONEN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}