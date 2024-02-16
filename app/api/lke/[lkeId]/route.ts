import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { lkeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isianLKE = await db.isianLKE.findUnique({
      where: {
        id: params.lkeId,
      },
    });

    if (!isianLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedIsianLKE = await db.isianLKE.delete({
      where: {
        id: params.lkeId,
      },
    });

    return NextResponse.json(deletedIsianLKE);
  } catch (error) {
    console.log("[LKE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { lkeId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { lkeId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // LKE DETAIL EDIT

    const isianLKE = await db.isianLKE.update({
      where: {
        id: lkeId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(isianLKE);
  } catch (error) {
    console.log("[LKE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}