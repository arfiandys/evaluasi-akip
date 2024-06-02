import { currentId } from "@/lib/auth";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { evaluasiId: string } }
) {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluasi = await db.evaluasi.findUnique({
            where: {
                id: params.evaluasiId,
            },
            include: {
                variabelsKKE: true,
                variabelsLKE: true,
                permindoks: true,
                IKUs: true,
            }
        });

        if (!evaluasi) {
            return new NextResponse("Not found", { status: 404 });
        }

        if (!evaluasi.variabelsKKE && !evaluasi.variabelsLKE && !evaluasi.permindoks && !evaluasi.IKUs) {
            return new NextResponse("Missing required variabel", { status: 401 });
        }

        const unitKerjas = await db.unitKerja.findMany({
            orderBy: {
                id: "asc"
            }
        });

        if (!unitKerjas) {
            return new NextResponse("Not found", { status: 404 });
        }

        // GENERATE LKE UNIT KERJA


        unitKerjas.map(async (unit) => {
            const variabelLKE = await db.variabelLKE.findMany({
                where: {
                    evaluasiId: params.evaluasiId
                },
                orderBy: {
                    id: "asc"
                }
            })

            const data = Array.from(variabelLKE).map((variabel) => ({
                variabelLKE: {
                    connect: {
                        id: variabel.id
                    }
                }
            }))

            const assignVariabelLKE = await db.unitKerja.update({
                where: {
                    id: unit.id
                },
                data: {
                    variabelLKEs: {
                        create: data
                    }
                }
            })
        })

        // GENERATE KKE UNIT KERJA

        unitKerjas.map(async (unit) => {
            const variabelKKE = await db.variabelKKE.findMany({
                where: {
                    evaluasiId: params.evaluasiId
                },
                orderBy: {
                    id: "asc"
                }
            })

            const data = Array.from(variabelKKE).map((variabel) => ({
                variabelKKE: {
                    connect: {
                        id: variabel.id
                    }
                }
            }))

            const assignVariabelKKE = await db.unitKerja.update({
                where: {
                    id: unit.id
                },
                data: {
                    variabelKKEUnitKerja: {
                        create: data
                    }
                }
            })
        })

        // GENERATE IKU UNIT KERJA

        unitKerjas.map(async (unit) => {
            const tujuanSasaranIndikator = await db.tujuanSasaranIndikatorIKUVariabelKKE.findMany({
                where: {
                    AND: [
                        {
                            variabelKKE: {
                                evaluasiId: params.evaluasiId
                            }
                        },
                        {
                            jenisIKU: unit.jenisUnitKerja
                        },
                    ]

                },
                orderBy: {
                    id: "asc"
                }
            })

            const data = Array.from(tujuanSasaranIndikator).map((variabel) => ({
                tujuanSasaranIndikatorIKUVariabelKKE: {
                    connect: {
                        id: variabel.id
                    }
                }
            }))

            const assignTujuanSasaranIndikator = await db.unitKerja.update({
                where: {
                    id: unit.id
                },
                data: {
                    tujuanSasaranIndikatorIKUVariabelKKEUnitKerja: {
                        create: data
                    }
                }
            })
        })

        // GENERATE PERMINDOK UNIT KERJA
        unitKerjas.map(async (unit) => {
            const permindok = await db.permindok.findMany({
                where: {
                    evaluasiId: params.evaluasiId
                },
                orderBy: {
                    id: "asc"
                }
            })

            const data = Array.from(permindok).map((variabel) => ({
                permindok: {
                    connect: {
                        id: variabel.id
                    }
                }
            }))

            const assignPermindok = await db.unitKerja.update({
                where: {
                    id: unit.id
                },
                data: {
                    permindoks: {
                        create: data
                    }
                }
            })
        })

        // GENERATE LHE UNIT KERJA
        unitKerjas.map(async (unit) => {
            const assignLHE = await db.unitKerja.update({
                where: {
                    id: unit.id
                },
                data: {
                    LHE: {
                        create: {
                            evaluasi: {
                                connect: {
                                    id: params.evaluasiId
                                }
                            }
                        }
                    }
                }
            })
        })

        // UPDATE EVALUASI STATUS

        const publishedEvaluasi = await db.evaluasi.update({
            where: {
                id: params.evaluasiId
            },
            data: {
                status: "publish"
            }
        })

        console.log(publishedEvaluasi.status)

        return NextResponse.json(publishedEvaluasi);

    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}