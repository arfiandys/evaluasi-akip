import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { tujuanId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tujuanIKU = await db.tujuanIKU.findUnique({
      where: {
        id: params.tujuanId,
      },
    });

    if (!tujuanIKU) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTujuanIKU = await db.tujuanIKU.delete({
      where: {
        id: params.tujuanId,
      },
    });

    return NextResponse.json(deletedTujuanIKU);
  } catch (error) {
    console.log("[TUJUAN_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tujuanId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { tujuanId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const tujuanIKU = await db.tujuanIKU.update({
      where: {
        id: tujuanId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tujuanIKU);
  } catch (error) {
    console.log("[TUJUAN_IKU_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}