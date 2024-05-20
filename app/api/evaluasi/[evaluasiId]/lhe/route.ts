import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { evaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (values.unitKerjaId && (values.action === "update")) {
      const LHEUnitKerja = await db.lHE.update({
        where: {
          LHEId: {
            unitKerjaId: values.unitKerjaId,
            evaluasiId: params.evaluasiId,
          }    
        },
        data: {
          url: values.url,
          nameDokumen: values.nameDokumen,
        }
      });
  
      return NextResponse.json(LHEUnitKerja);
    }

    if (values.unitKerjaId && (values.action === "delete")) {
      const LHEUnitKerja = await db.lHE.update({
        where: {
          LHEId: {
            unitKerjaId: values.unitKerjaId,
            evaluasiId: params.evaluasiId,
          }    
        },
        data: {
          url: null,
          nameDokumen: null,
        }
      });
  
      return NextResponse.json(LHEUnitKerja);
    }

    return NextResponse.json("Aksi kosong");
    
  } catch (error) {
    console.log("LHE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

