import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { subKriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subKriteriaLKE = await db.subKriteriaLKE.findUnique({
      where: {
        id: params.subKriteriaId,
      },
    });

    if (!subKriteriaLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedSubKriteriaLKE = await db.subKriteriaLKE.delete({
      where: {
        id: params.subKriteriaId,
      },
    });

    return NextResponse.json(deletedSubKriteriaLKE);
  } catch (error) {
    console.log("[SUB_KRITERIA_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { kriteriaId: string, subKriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { subKriteriaId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // SUB KOMPONEN DETAIL EDIT

    const existingKodeSubKriteria = await db.subKriteriaLKE.findFirst({
      where: {
        AND: [
          {
            kode: values.kode,
          },
          {
            kriteriaLKEId: params.kriteriaId
          }
        ]
      }
    })

    if (existingKodeSubKriteria && existingKodeSubKriteria.id!==params.subKriteriaId) {
      return NextResponse.json({ error: "Kode talah digunakan!" });
    }

    const existingNameSubKriteria = await db.subKriteriaLKE.findFirst({
      where: {
        AND: [
          {
            name: values.name,
          },
          {
            kriteriaLKEId: params.kriteriaId
          }
        ]
      }
    })

    if (existingNameSubKriteria && existingNameSubKriteria.id!==params.subKriteriaId) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

    const subKriteriaLKE = await db.subKriteriaLKE.update({
      where: {
        id: subKriteriaId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(subKriteriaLKE);
  } catch (error) {
    console.log("[KRITERIA_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}