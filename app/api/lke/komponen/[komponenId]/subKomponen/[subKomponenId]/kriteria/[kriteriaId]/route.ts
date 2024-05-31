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

    const kriteriaLKE = await db.kriteriaLKE.findUnique({
      where: {
        id: params.kriteriaId,
      },
    });

    if (!kriteriaLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedKriteriaLKE = await db.kriteriaLKE.delete({
      where: {
        id: params.kriteriaId,
      },
    });

    return NextResponse.json(deletedKriteriaLKE);
  } catch (error) {
    console.log("[KRITERIA_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { subKomponenId: string, kriteriaId: string } }
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

    const existingKodeKriteria = await db.kriteriaLKE.findFirst({
      where: {
        AND: [
          {
            kode: values.kode,
          },
          {
            subKomponenLKEId: params.subKomponenId
          }
        ]
      }
    })

    if (existingKodeKriteria && existingKodeKriteria.id!==params.kriteriaId) {
      return NextResponse.json({ error: "Kode talah digunakan!" });
    }

    const existingNameKriteria = await db.kriteriaLKE.findFirst({
      where: {
        AND: [
          {
            name: values.name,
          },
          {
            subKomponenLKEId: params.subKomponenId
          }
        ]
      }
    })

    if (existingNameKriteria && existingNameKriteria.id!==params.kriteriaId) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

    const kriteriaLKE = await db.kriteriaLKE.update({
      where: {
        id: kriteriaId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(kriteriaLKE);
  } catch (error) {
    console.log("[KRITERIA_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}