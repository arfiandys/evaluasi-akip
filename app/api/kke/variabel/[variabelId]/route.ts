import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { variabelId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const variabelKKE = await db.variabelKKE.findUnique({
      where: {
        id: params.variabelId,
      },
    });

    if (!variabelKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedVariabelKKE = await db.variabelKKE.delete({
      where: {
        id: params.variabelId,
      },
    });

    return NextResponse.json(deletedVariabelKKE);
  } catch (error) {
    console.log("[VARIABEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { variabelId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { variabelId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if ((values.unitKerjaId!) && (values.input! === "input")) {
      const KKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: variabelId,
            unitKerjaId: values.unitKerjaId 
          }
        },
        data: {        
          isianAt: values.values.isianAt,
          isianKt: values.values.isianKt,
          isianDalnis: values.values.isianDalnis,
          isianPIC: values.values.isianPIC       
        },
      });
  
      return NextResponse.json(KKEUnitKerja);
    }

    if ((values.kriteriaKKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelKKE = await db.variabelKKE.update({
        where: {
          id: variabelId,
        },
        data: {        
          kriteriaKKEId: values.kriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });
  
      return NextResponse.json(variabelKKE);
    }

    // LKE DETAIL EDIT

    const variabelKKE = await db.variabelKKE.update({
      where: {
        id: variabelId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(variabelKKE);
  } catch (error) {
    console.log("[VARIABEL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}