import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { tujuanSasaranIndikatorId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.findUnique({
      where: {
        id: params.tujuanSasaranIndikatorId,
      },
    });

    if (!tujuanSasaranIndikatorIKU) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.delete({
      where: {
        id: params.tujuanSasaranIndikatorId,
      },
    });

    return NextResponse.json(deletedTujuanSasaranIndikatorIKU);
  } catch (error) {
    console.log("[TUJUAN/SASARAN/INDIKATOR_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { tujuanSasaranIndikatorId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { tujuanSasaranIndikatorId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.update({
      where: {
        id: tujuanSasaranIndikatorId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tujuanSasaranIndikatorIKU);
  } catch (error) {
    console.log("[TUJUAN_IKU_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}