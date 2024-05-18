import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { permindokId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const permindok = await db.permindok.findUnique({
      where: {
        id: params.permindokId,
      },
    });

    if (!permindok) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedPermindok = await db.permindok.delete({
      where: {
        id: params.permindokId,
      },
    });

    return NextResponse.json(deletedPermindok);
  } catch (error) {
    console.log("[PERMINDOK_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

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

    // UPDATE RINCIAN PERMINDOK

    const user = await db.permindok.update({
      where: {
        id: params.permindokId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user);
    
  } catch (error) {
    console.log("PERMINDOK", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

