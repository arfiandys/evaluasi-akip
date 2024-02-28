import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { kelompokKriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
      where: {
        id: params.kelompokKriteriaId,
      },
    });

    if (!kelompokKriteria) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedkelompokKriteri = await db.kelompokKriteriaKKE.delete({
      where: {
        id: params.kelompokKriteriaId,
      },
    });

    return NextResponse.json(deletedkelompokKriteri);
  } catch (error) {
    console.log("[KELOMPOK_KRITERIA_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { kelompokKriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { kelompokKriteriaId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const kelompokKriteria = await db.kelompokKriteriaKKE.update({
      where: {
        id: kelompokKriteriaId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(kelompokKriteria);
  } catch (error) {
    console.log("[KELOMPOK_KRITERIA_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}