import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (const item of values.data) {
            if (item.level === "kelompok") {
                const existingNamaKelompok = await db.kelompokKriteriaKKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaKelompok
                            },
                            {
                                tahun: values.tahun
                            }
                        ]
                    }
                })
                if (!existingNamaKelompok) {
                    const permindok = await db.permindok.findFirst({
                        where: {
                            AND: [
                                {
                                    evaluasiId: values.evaluasiId,
                                },
                                {
                                    kode: item.kodePermindok
                                }
                            ]

                        }
                    })
                    if (permindok) {
                        const kelompokKriteria = await db.kelompokKriteriaKKE.create({
                            data: {
                                name: item.namaKelompok,
                                kode: item.kode,
                                tahun: values.tahun,
                                evaluasiId: values.evaluasiId,
                                permindokId: permindok.id!
                            }
                        })
                    }
                }
            }

            if (item.level === "kriteria") {
                const existingNamaKriteria = await db.kriteriaKKE.findFirst({
                    where: {
                        AND: [
                            {
                                nama: item.namaKriteria
                            },
                            {
                                kelompokKriteriaKKE: {
                                    tahun: values.tahun
                                }
                            }
                        ]
                    }
                })
                if (!existingNamaKriteria) {
                    const kelompokKriteria = await db.kelompokKriteriaKKE.findFirst({
                        where: {
                            AND: [
                                {
                                    evaluasiId: values.evaluasiId,
                                },
                                {
                                    name: item.namaKelompok
                                }
                            ]
                        }
                    });

                    if (kelompokKriteria) {

                        const variabelLKE = await db.variabelLKE.findFirst({
                            where: {
                                AND: [
                                    {
                                        evaluasiId: values.evaluasiId,
                                    },
                                    {
                                        kode: item.kodeLKE
                                    }
                                ]
                            }
                        });

                        if (variabelLKE) {
                            if (item.jenisKK === "KK Evaluasi Dokumen") {
                                const kriteriaKKE = await db.kriteriaKKE.create({
                                    data: {
                                        kelompokKriteriaKKEId: kelompokKriteria.id!,
                                        kode: variabelLKE.kode,
                                        nama: item.namaKriteria,
                                    },
                                    include: {
                                        kelompokKriteriaKKE: true
                                    }
                                })
                                const variabelKKE = await db.variabelKKE.create({
                                    data: {
                                        evaluasiId: values.evaluasiId,
                                        kriteriaKKEId: kriteriaKKE.id,
                                        tahun: kriteriaKKE.kelompokKriteriaKKE.tahun,
                                        variabelLKEId: variabelLKE.id,
                                        kode: variabelLKE.kode,
                                        jenisIsian: variabelLKE.jenisIsian,
                                        isIndikatorKinerja: false,
                                        jenisIsianIKU: null,
                                        petunjukEvaluasi: item.petunjukEvaluasi,
                                    }
                                })
                            }
                            if ((item.jenisKK === "KK Indikator Kinerja") && (variabelLKE.jenisIsian === "number")) {
                                const kriteriaKKE = await db.kriteriaKKE.create({
                                    data: {
                                        kelompokKriteriaKKEId: kelompokKriteria.id!,
                                        kode: variabelLKE.kode,
                                        nama: item.namaKriteria,
                                    },
                                    include: {
                                        kelompokKriteriaKKE: true
                                    }
                                })
                                const variabelKKE = await db.variabelKKE.create({
                                    data: {
                                        evaluasiId: values.evaluasiId,
                                        kriteriaKKEId: kriteriaKKE.id,
                                        tahun: kriteriaKKE.kelompokKriteriaKKE.tahun,
                                        variabelLKEId: variabelLKE.id,
                                        kode: variabelLKE.kode,
                                        jenisIsian: variabelLKE.jenisIsian,
                                        isIndikatorKinerja: true,
                                        jenisIsianIKU: "select",
                                        petunjukEvaluasi: item.petunjukEvaluasi,
                                    }
                                })
                            }
                        }
                    }
                }
            }

            if (item.level === "iku") {
                const variabelKKE = await db.variabelKKE.findFirst({
                    where: {
                        AND: [
                            {
                                kriteriaKKE: {
                                    nama: item.namaKriteria
                                }
                            },
                            {
                                evaluasiId: values.evaluasiId
                            }
                        ]
                    }
                })

                if (variabelKKE) {
                    const tsi = await db.tujuanSasaranIndikatorIKU.findFirst({
                        where: {
                            AND: [
                                {
                                    IKU: {
                                        evaluasiId: values.evaluasiId,
                                    }
                                },
                                {
                                    IKU: {
                                        name: item.IKU,
                                    }
                                },
                                {
                                    kode: item.kodeIKU
                                }
                            ]
                        },
                        include: {
                            IKU: true
                        }
                    });

                    if (tsi) {
                        const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.create({
                            data: {
                                jenisIKU: item.IKU,
                                variabelKKEId: variabelKKE.id,
                                tujuanSasaranIndikatorIKUId: tsi.id
                            }
                        })
                    }
                }
            }
        };

        return NextResponse.json("Level Not Found")

    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}