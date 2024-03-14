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

    const variabelLKE = await db.variabelLKE.findUnique({
      where: {
        id: params.variabelId,
      },
    });

    if (!variabelLKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedVariabelLKE = await db.variabelLKE.delete({
      where: {
        id: params.variabelId,
      },
    });

    return NextResponse.json(deletedVariabelLKE);
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
      const LKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: variabelId,
            unitKerjaId: values.unitKerjaId 
          }
        },
        data: {        
          isianAt: values.values.isianAt,
          isianKt: values.values.isianKt,
          isianDalnis: values.values.isianDalnis,
          catatanAt: values.values.catatanAt,
          catatanKt: values.values.catatanKt,
          catatanDalnis: values.values.catatanDalnis,       
        },
      });
  
      return NextResponse.json(LKEUnitKerja);
    }

    if ((values.subKriteriaLKEId!) && (values.variabel! === "subKriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {        
          subKriteriaLKEId: values.subKriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });
  
      return NextResponse.json(variabelLKE);
    }

    if ((values.kriteriaLKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {        
          kriteriaLKEId: values.kriteriaLKEId,
          kode: values.kode,
          tahun: values.tahun
        },
      });
  
      return NextResponse.json(variabelLKE);
    }

    if (values.changeIsSubKriteria! === "change") {
      const variabelLKE = await db.variabelLKE.update({
        where: {
          id: variabelId,
        },
        data: {          
          kriteriaLKE: {
            disconnect: true
          },
          subKriteriaLKE: {
            disconnect: true
          },
          isSubKriteria: values.isSubKriteria,
        },
      });
  
      return NextResponse.json(variabelLKE);
    }

    // LKE DETAIL EDIT

    const variabelLKE = await db.variabelLKE.update({
      where: {
        id: variabelId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(variabelLKE);
  } catch (error) {
    console.log("[VARIABEL_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}