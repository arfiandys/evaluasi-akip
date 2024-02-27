import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { sasaranId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sasaranIKU = await db.sasaranIKU.findUnique({
      where: {
        id: params.sasaranId,
      },
    });

    if (!sasaranIKU) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedSasaranIKU = await db.sasaranIKU.delete({
      where: {
        id: params.sasaranId,
      },
    });

    return NextResponse.json(deletedSasaranIKU);
  } catch (error) {
    console.log("SASARAN_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sasaranId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { sasaranId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const sasaranIKU = await db.sasaranIKU.update({
      where: {
        id: sasaranId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(sasaranIKU);
  } catch (error) {
    console.log("[SASARAN_IKU_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}