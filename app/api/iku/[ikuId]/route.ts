import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { ikuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const IKU = await db.iKU.findUnique({
      where: {
        id: params.ikuId,
      },
    });

    if (!IKU) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedIKU = await db.iKU.delete({
      where: {
        id: params.ikuId,
      },
    });

    return NextResponse.json(deletedIKU);
  } catch (error) {
    console.log("[IKU_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { ikuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { ikuId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const IKU = await db.iKU.update({
      where: {
        id: ikuId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(IKU);
  } catch (error) {
    console.log("[IKU_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}