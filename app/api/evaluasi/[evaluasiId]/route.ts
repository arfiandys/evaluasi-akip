import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { evaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const evaluasi = await db.evaluasi.findUnique({
      where: {
        id: params.evaluasiId,
      },
    });

    if (!evaluasi) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedEvaluasi = await db.evaluasi.delete({
      where: {
        id: params.evaluasiId,
      },
    });

    return NextResponse.json(deletedEvaluasi);
  } catch (error) {
    console.log("[EVALUASI_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { evaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { evaluasiId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // EVALUASI DETAIL EDIT

    const existingTahunEvaluasi = await db.evaluasi.findUnique({
      where: {
          tahun: values.tahun,
      }
  })

  if (existingTahunEvaluasi && existingTahunEvaluasi.id !== params.evaluasiId ) {
      return NextResponse.json({ error: "Tahun talah digunakan!" });
  }

    const evaluasi = await db.evaluasi.update({
      where: {
        id: evaluasiId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(evaluasi);
  } catch (error) {
    console.log("[EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}