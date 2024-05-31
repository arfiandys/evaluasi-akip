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

    // KELOMPOK KRITERIA KKE DETAIL EDIT

    const existingKodeKelompok = await db.kelompokKriteriaKKE.findFirst({
      where: {
        AND: [
          {
            kode: values.kode,
          },
          {
            evaluasiId: values.evaluasiId
          }
        ]
      }
    })

    if (existingKodeKelompok && existingKodeKelompok.id!==params.kelompokKriteriaId) {
      return NextResponse.json({ error: "Kode talah digunakan!" });
    }

    const existingNameKelompok = await db.kelompokKriteriaKKE.findFirst({
      where: {
        AND: [
          {
            name: values.name,
          },
          {
            evaluasiId: values.evaluasiId
          }
        ]
      }
    })

    if (existingNameKelompok && existingNameKelompok.id!==params.kelompokKriteriaId) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

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