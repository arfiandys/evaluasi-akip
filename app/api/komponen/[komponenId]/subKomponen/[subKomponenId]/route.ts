import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function DELETE(
  req: Request,
  { params }: { params: { subKomponenId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subKomponenLKE = await db.subKomponenLKE.findUnique({
      where: {
        id: params.subKomponenId,
      },
    });

    if (!subKomponenLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedSubKomponenLKE = await db.subKomponenLKE.delete({
      where: {
        id: params.subKomponenId,
      },
    });

    return NextResponse.json(deletedSubKomponenLKE);
  } catch (error) {
    console.log("[SUB_KOMPONEN_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { subKomponenId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { subKomponenId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // SUB KOMPONEN DETAIL EDIT

    const subKomponenLKE = await db.subKomponenLKE.update({
      where: {
        id: subKomponenId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(subKomponenLKE);
  } catch (error) {
    console.log("[SUB_KOMPONEN_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}