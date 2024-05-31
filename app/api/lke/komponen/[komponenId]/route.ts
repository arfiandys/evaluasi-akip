import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { komponenId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const komponenLKE = await db.komponenLKE.findUnique({
      where: {
        id: params.komponenId,
      },
    });

    if (!komponenLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedKomponenLKE = await db.komponenLKE.delete({
      where: {
        id: params.komponenId,
      },
    });

    return NextResponse.json(deletedKomponenLKE);
  } catch (error) {
    console.log("[KOMPONEN_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { komponenId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { komponenId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // KOMPONEN LKE DETAIL EDIT

    const existingKodeKomponen = await db.komponenLKE.findFirst({
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

    if (existingKodeKomponen && existingKodeKomponen.id!==params.komponenId) {
      return NextResponse.json({ error: "Kode talah digunakan!" });
    }

    const existingNameKomponen = await db.komponenLKE.findFirst({
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

    if (existingNameKomponen && existingNameKomponen.id!==params.komponenId) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

    const komponenLKE = await db.komponenLKE.update({
      where: {
        id: komponenId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(komponenLKE);
  } catch (error) {
    console.log("[KOMPONEN_EVALUASI_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}