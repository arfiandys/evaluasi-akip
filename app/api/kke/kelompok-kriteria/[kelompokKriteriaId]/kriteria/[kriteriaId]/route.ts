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

    const kriteriaKKE = await db.kriteriaKKE.findUnique({
      where: {
        id: params.kriteriaId,
      },
    });

    if (!kriteriaKKE) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedkriteriaKKE = await db.kriteriaKKE.delete({
      where: {
        id: params.kriteriaId,
      },
    });

    return NextResponse.json(deletedkriteriaKKE);
  } catch (error) {
    console.log("[KRITERIA_KKE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { kriteriaId: string, kelompokKriteriaId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // KRITERIA KKE DETAIL EDIT

    const existingKodeKriteria = await db.kriteriaKKE.findFirst({
      where: {
        AND: [
          {
            kode: values.kode,
          },
          {
            kelompokKriteriaKKEId: params.kelompokKriteriaId
          }
        ]
      }
    })

    if (existingKodeKriteria && existingKodeKriteria.id!==params.kriteriaId) {
      return NextResponse.json({ error: "Kode talah digunakan!" });
    }

    const existingNameKriteria = await db.kriteriaKKE.findFirst({
      where: {
        AND: [
          {
            nama: values.nama,
          },
          {
            kelompokKriteriaKKEId: params.kelompokKriteriaId
          }
        ]
      }
    })

    if (existingNameKriteria && existingNameKriteria.id!==params.kriteriaId) {
      return NextResponse.json({ error: "Nama talah digunakan!" });
    }

    const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
      where: {
        id: params.kelompokKriteriaId,
      }
    });

    if (!kelompokKriteria) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const kriteriaKKE = await db.kriteriaKKE.update({
      where: {
        id: params.kriteriaId
      },
      data: {
        kode: values.kode,
        nama: values.nama,
      },
      include: {
        kelompokKriteriaKKE: true,
        variabelKKE: true
      }
    })

    const variabelKKE = await db.variabelKKE.update({
      where: {
        id: kriteriaKKE.variabelKKE?.id
      },
      data: {
        evaluasiId: values.evaluasiId,
        kriteriaKKEId: kriteriaKKE.id,
        tahun: kriteriaKKE.kelompokKriteriaKKE.tahun,
        variabelLKEId: values.variabelLKEId,
        kode: values.kode,
        jenisIsian: values.jenisIsian,
        isIndikatorKinerja: values.isIndikatorKinerja,
        jenisIsianIKU: values.jenisIsianIKU,
        petunjukEvaluasi: values.petunjukEvaluasi,
      }
    })

    const deleteTSI = await db.tujuanSasaranIndikatorIKUVariabelKKE.deleteMany({
      where: {
        variabelKKEId: variabelKKE.id
      }
    })

    values.items.forEach(async (element: string) => {
      console.log(element)
      const tsi = await db.tujuanSasaranIndikatorIKU.findUnique({
        where: {
          id: element,
        },
        include: {
          IKU: true
        }
      });
      const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.create({
        data: {
          jenisIKU: tsi?.IKU?.name || "",
          variabelKKEId: variabelKKE.id,
          tujuanSasaranIndikatorIKUId: element
        }
      })
    });

    return NextResponse.json(kriteriaKKE);
  } catch (error) {
    console.log("[KRITERIA_KKE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}