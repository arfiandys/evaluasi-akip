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

    if ((values.unitKerjaId!) && (values.variabelKKEId!) && (values.action! === "updateIsianVariabel")) {

      const isianIKUKKIndikatorUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
          AND: [
            {
              tujuanSasaranIndikatorIKUVariabelKKE: {
                variabelKKEId: values.variabelKKEId
              }
            },
            {
              unitKerjaId: values.unitKerjaId
            }
          ]
        }
      })
      
      let jumlah: number = 0;
      let banyak: number = 0;

      isianIKUKKIndikatorUnitKerja.forEach((data)=>{
        jumlah += (data.isianAt==="ya") ? (1):(0);
        banyak += 1;
      })

      const variabelKKEUnitKerja = await db.variabelKKEUnitKerja.update({
        where: {
          VariabelKKEUnitKerjaId: {
            variabelKKEId: values.variabelKKEId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianAt: ((jumlah*100)/banyak).toString(),
        },
      });

      const variabelLKE = await db.variabelLKE.findUnique({
        where: {
          id: values.variabelLKEId
        },
        include: {
          kriteriaLKE: true,
          subKriteriaLKE: true,
        }
      })

      let nilai = ""
      if (((jumlah*100)/banyak).toString()) {
        nilai = ((variabelLKE?.kriteriaLKE?.bobot || (variabelLKE?.subKriteriaLKE?.bobot || 0)) * Number(((jumlah*100)/banyak).toString())).toString();
      }

      const variabelLKEUnitKerja = await db.lKEUnitKerja.update({
        where: {
          LKEUnitKerjaId: {
            variabelLKEId: values.variabelLKEId,
            unitKerjaId: values.unitKerjaId
          }
        },
        data: {
          isianAt: ((jumlah*100)/banyak).toString(),
          nilaiAt: nilai
        },
      });

      return NextResponse.json(variabelKKEUnitKerja);
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