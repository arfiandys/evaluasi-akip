import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { kriteriaId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const kriteria = await db.kriteriaLKE.findUnique({
            where: {
                id: params.kriteriaId,
            }
        });

        if (!kriteria) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

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

        if (existingKodeSubKriteria) {
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

        if (existingNameSubKriteria) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const subKriteriaLKE = await db.subKriteriaLKE.create({
            data: {
                kriteriaLKEId: params.kriteriaId,
                kode: values.kode,
                name: values.name,
                bobot: values.bobot,
            },
            include: {
                kriteriaLKE: {
                    include: {
                        subKomponenLKE: {
                            include: {
                                komponenLKE: true
                            }
                        }
                    }
                }
            }
        })

        const variabelLKE = await db.variabelLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                subKriteriaLKEId: subKriteriaLKE.id,
                kode: subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.komponenLKE?.kode.concat(".", subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.kode.concat(".", subKriteriaLKE.kriteriaLKE?.kode.concat(".", subKriteriaLKE.kode))) || "",
                tahun: subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.komponenLKE?.tahun || "",
                jenisIsian: values.jenisIsian,
                levelVariabel: values.levelVariabel,
                catatanPositif: values.catatanPositif,
                catatanNegatif: values.catatanNegatif,
                catatanA: values.catatanA,
                catatanB: values.catatanB,
                catatanC: values.catatanC,
            }
        })

        return NextResponse.json(subKriteriaLKE);

    } catch (error) {
        console.log("[SUB_KRITERIA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}