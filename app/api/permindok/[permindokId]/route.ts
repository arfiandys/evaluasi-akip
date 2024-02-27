import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { permindokId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (values.unitKerjaId && (values.action === "update")) {
      const permindokUnitKerja = await db.permindokUnitKerja.update({
        where: {
          permindokUnitKerjaId: {
            unitKerjaId: values.unitKerjaId,
            permindokId: params.permindokId,
          }    
        },
        data: {
          url: values.url,
          nameDokumen: values.nameDokumen,
        }
      });
  
      return NextResponse.json(permindokUnitKerja);
    }

    if (values.unitKerjaId && (values.action === "delete")) {
      const permindokUnitKerja = await db.permindokUnitKerja.update({
        where: {
          permindokUnitKerjaId: {
            unitKerjaId: values.unitKerjaId,
            permindokId: params.permindokId,
          }    
        },
        data: {
          url: null,
          nameDokumen: null,
        }
      });
  
      return NextResponse.json(permindokUnitKerja);
    }
    
  } catch (error) {
    console.log("PERMINDOK_UNITKERJA", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

