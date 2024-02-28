import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { kriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kriteriaKKE = await db.kriteriaKKE.findUnique({
      where: {
        id: params.kriteriaId,
      },
    });

    if (!kriteriaKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedkriteriaKKE = await db.kriteriaKKE.delete({
      where: {
        id: params.kriteriaId,
      },
    });

    return NextResponse.json(deletedkriteriaKKE);
  } catch (error) {
    console.log("[KRITERIA_KKE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { kriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { kriteriaId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // SUB KOMPONEN DETAIL EDIT

    const kriteriaKKE = await db.kriteriaKKE.update({
      where: {
        id: kriteriaId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(kriteriaKKE);
  } catch (error) {
    console.log("[KRITERIA_KKE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}