import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { variabelIkuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.findUnique({
      where: {
        id: params.variabelIkuId,
      },
    });

    if (!tujuanSasaranIndikatorIKUVariabelKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.delete({
      where: {
        id: params.variabelIkuId,
      },
    });

    return NextResponse.json(deletedTujuanSasaranIndikatorIKUVariabelKKE);
  } catch (error) {
    console.log("[VARIABEL_IKU_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { variabelIkuId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const { variabelIkuId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if ((values.unitKerjaId!) && (values.input! === "input")) {
      const IKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.update({
        where: {
          TujuanSasaranIndikatorIKUVariabelKKEUnitKerjaId: {
            tujuanSasaranIndikatorIKUVariabelKKEId: variabelIkuId,
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

      return NextResponse.json(IKUUnitKerja);
    }

    // TODO: edit variabelKKEIKU

    // if ((values.kriteriaKKEId!) && (values.variabel! === "kriteria") && (values.action! === "yearCodeGenerate")) {
    //   const variabelKKE = await db.variabelKKE.update({
    //     where: {
    //       id: variabelIkuId,
    //     },
    //     data: {        
    //       kriteriaKKEId: values.kriteriaLKEId,
    //       kode: values.kode,
    //       tahun: values.tahun
    //     },
    //   });

    //   return NextResponse.json(variabelKKE);
    // }

    // LKE DETAIL EDIT

    const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.update({
      where: {
        id: variabelIkuId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tujuanSasaranIndikatorIKUVariabelKKE);
  } catch (error) {
    console.log("[VARIABEL_IKU_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}