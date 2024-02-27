import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { indikatorId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const indikatorIKU = await db.indikatorIKU.findUnique({
      where: {
        id: params.indikatorId,
      },
    });

    if (!indikatorIKU) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedIndikatorIKU = await db.indikatorIKU.delete({
      where: {
        id: params.indikatorId,
      },
    });

    return NextResponse.json(deletedIndikatorIKU);
  } catch (error) {
    console.log("INDIKATOR_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { indikatorId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { indikatorId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const indikatorIKU = await db.indikatorIKU.update({
      where: {
        id: indikatorId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(indikatorIKU);
  } catch (error) {
    console.log("[INDIKATOR_IKU_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}