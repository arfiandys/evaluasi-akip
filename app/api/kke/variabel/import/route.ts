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

        interface PesanError {
            error: string;
            konten: string;
        }

        const jsonString = `[]`;

        // Parse the JSON string into an array of objects
        let arrayError: PesanError[] = JSON.parse(jsonString);

        for (const item of values.data) {
            if (item.level === "kelompok") {
                const existingNamaKelompok = await db.kelompokKriteriaKKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaKelompok
                            },
                            {
                                evaluasiId: values.evaluasiId
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
                                evaluasiId: values.evaluasiId,
                                permindokId: permindok.id!
                            }
                        })
                    } else {
                        arrayError.push({ error: "permindok tidak ditemukan", konten: item.namaKelompok });
                    }
                } else {
                    arrayError.push({ error: "nama kelompok sudah digunakan", konten: item.namaKelompok });
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
                                    evaluasiId: values.evaluasiId
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
                                        variabelLKEId: variabelLKE.id,
                                        kode: variabelLKE.kode,
                                        jenisIsian: variabelLKE.jenisIsian,
                                        isIndikatorKinerja: false,
                                        jenisIsianIKU: null,
                                        petunjukEvaluasi: item.petunjukEvaluasi,
                                    }
                                })
                            } else if ((item.jenisKK === "KK Indikator Kinerja") && (variabelLKE.jenisIsian === "number")) {
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
                                        variabelLKEId: variabelLKE.id,
                                        kode: variabelLKE.kode,
                                        jenisIsian: variabelLKE.jenisIsian,
                                        isIndikatorKinerja: true,
                                        jenisIsianIKU: "select",
                                        petunjukEvaluasi: item.petunjukEvaluasi,
                                    }
                                })
                            } else {
                                arrayError.push({ error: "jenis kertas kerja tidak ditemukan", konten: item.namaKriteria });
                            }
                        }
                    } else {
                        arrayError.push({ error: "kelompok tidak ditemukan", konten: item.namaKriteria });
                    }
                } else {
                    arrayError.push({ error: "nama kriteria sudah digunakan", konten: item.namaKriteria });
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
                        const tsiVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.findFirst({
                            where: {
                                AND: [
                                    {
                                        variabelKKEId: variabelKKE.id
                                    },
                                    {
                                        tujuanSasaranIndikatorIKUId: tsi.id
                                    }
                                ]
                            }
                        })
                        if (!tsiVariabelKKE) {
                            const tujuanSasaranIndikatorIKUVariabelKKE = await db.tujuanSasaranIndikatorIKUVariabelKKE.create({
                                data: {
                                    variabelKKEId: variabelKKE.id,
                                    tujuanSasaranIndikatorIKUId: tsi.id
                                }
                            })
                        } else {
                            arrayError.push({ error: "kode tujuan/sasaran/indikator sudah digunakan", konten: item.kodeIKU });
                        }
                    } else {
                        arrayError.push({ error: "kode tujuan/sasaran/indikator tidak ditemukan", konten: item.kodeIKU });
                    }
                } else {
                    arrayError.push({ error: "variabel kke tidak ditemukan", konten: item.kodeIKU });
                }
            }
        };

        return NextResponse.json({ return: arrayError })

    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}