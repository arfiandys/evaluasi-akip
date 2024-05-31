import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { kelompokKriteriaId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
            where: {
                id: params.kelompokKriteriaId,
            }
        });

        if (!kelompokKriteria) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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

        if (existingKodeKriteria) {
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

        if (existingNameKriteria) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const kriteriaKKE = await db.kriteriaKKE.create({
            data: {
                kelompokKriteriaKKEId: params.kelompokKriteriaId,
                kode: values.kode,
                nama: values.nama,
            },
            include:{
                kelompokKriteriaKKE: true
            }
        })

        const variabelKKE = await db.variabelKKE.create({
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

        values.items.forEach(async (element:string) => {
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
                    jenisIKU: tsi?.IKU?.name||"",
                    variabelKKEId: variabelKKE.id,
                    tujuanSasaranIndikatorIKUId: element
                }
            })
        });

        return NextResponse.json(kriteriaKKE);

    } catch (error) {
        console.log("[KRITERIA_KKE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}