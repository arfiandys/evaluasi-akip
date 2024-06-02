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
            if (item.level === "komponen") {
                const existingNamaKomponen = await db.komponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaKomponen
                            },
                            {
                                evaluasiId: values.evaluasiId
                            }
                        ]
                    }
                })
                if (!existingNamaKomponen) {
                    const komponenLKE = await db.komponenLKE.create({
                        data: {
                            evaluasiId: values.evaluasiId,
                            kode: item.kode,
                            name: item.namaKomponen,
                            bobot: item.bobot,
                        }
                    })

                    const variabelLKE = await db.variabelLKE.create({
                        data: {
                            evaluasiId: values.evaluasiId,
                            komponenLKEId: komponenLKE.id,
                            kode: komponenLKE.kode || "",
                            jenisIsian: "number",
                            levelVariabel: "komponen",
                        }
                    })
                } else {
                    arrayError.push({ error: "nama komponen sudah digunakan", konten: item.namaKomponen });
                }
            }

            if (item.level === "subKomponen") {
                const existingNamaSubKomponen = await db.subKomponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaSubKomponen
                            },
                            {
                                komponenLKE: {
                                    evaluasiId: values.evaluasiId
                                }
                            }
                        ]
                    }
                })
                if (!existingNamaSubKomponen) {
                    const komponen = await db.komponenLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    evaluasiId: values.evaluasiId
                                },
                                {
                                    name: item.namaKomponen
                                }
                            ]
                        }
                    });

                    if (!komponen) {
                        arrayError.push({ error: "komponen tidak ditemukan", konten: item.namaSubKomponen });
                    }

                    const subKomponenLKE = await db.subKomponenLKE.create({
                        data: {
                            komponenLKEId: komponen?.id,
                            kode: item.kode,
                            name: item.namaSubKomponen,
                            bobot: item.bobot,
                        },
                        include: {
                            komponenLKE: true
                        }
                    })

                    const variabelLKE = await db.variabelLKE.create({
                        data: {
                            evaluasiId: values.evaluasiId,
                            subKomponenLKEId: subKomponenLKE.id,
                            kode: subKomponenLKE.komponenLKE?.kode.concat(".", subKomponenLKE.kode) || "",
                            jenisIsian: "number",
                            levelVariabel: "subKomponen",
                        }
                    })
                } else {
                    arrayError.push({ error: "nama sub komponen sudah digunakan", konten: item.namaSubKomponen });
                }
            }

            if (item.level === "kriteria") {
                const existingNamaKriteria = await db.kriteriaLKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaKriteria
                            },
                            {
                                subKomponenLKE: {
                                    komponenLKE: {
                                        evaluasiId: values.evaluasiId
                                    }
                                }
                            }
                        ]
                    }
                })
                if (!existingNamaKriteria) {
                    const komponen = await db.komponenLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    evaluasiId: values.evaluasiId
                                },
                                {
                                    name: item.namaKomponen
                                }
                            ]
                        }
                    });

                    if (!komponen) {
                        arrayError.push({ error: "komponen tidak ditemukan", konten: item.namaKriteria });
                    }

                    const subKomponen = await db.subKomponenLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    komponenLKEId: komponen?.id
                                },
                                {
                                    name: item.namaSubKomponen
                                }
                            ]
                        }
                    });

                    if (!subKomponen) {
                        arrayError.push({ error: "sub komponen tidak ditemukan", konten: item.namaKriteria });
                    }

                    const kriteriaLKE = await db.kriteriaLKE.create({
                        data: {
                            subKomponenLKEId: subKomponen?.id,
                            kode: item.kode,
                            name: item.namaKriteria,
                            bobot: item.bobot,
                        },
                        include: {
                            subKomponenLKE: {
                                include: {
                                    komponenLKE: true
                                }
                            }
                        }
                    })

                    const variabelLKE = await db.variabelLKE.create({
                        data: {
                            evaluasiId: values.evaluasiId,
                            kriteriaLKEId: kriteriaLKE.id,
                            kode: kriteriaLKE.subKomponenLKE?.komponenLKE?.kode.concat(".", kriteriaLKE?.subKomponenLKE?.kode.concat(".", kriteriaLKE?.kode)) || "",
                            jenisIsian: item.jenisIsian,
                            levelVariabel: "kriteria",
                            catatanPositif: item.catatanPositif,
                            catatanNegatif: item.catatanNegatif,
                            catatanA: item.catatanA,
                            catatanB: item.catatanB,
                            catatanC: item.catatanC,
                            isPembobot: item.isPembobot,
                        }
                    })
                } else {
                    arrayError.push({ error: "nama kriteria sudah digunakan", konten: item.namaKriteria });
                }
            }

            if (item.level === "subKriteria") {
                const existingNamaSubKriteria = await db.subKriteriaLKE.findFirst({
                    where: {
                        AND: [
                            {
                                name: item.namaSubKriteria
                            },
                            {
                                kriteriaLKE: {
                                    subKomponenLKE: {
                                        komponenLKE: {
                                            evaluasiId: values.evaluasiId
                                        }
                                    }
                                }
                            }
                        ]
                    }
                })
                if (!existingNamaSubKriteria) {
                    const komponen = await db.komponenLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    evaluasiId: values.evaluasiId
                                },
                                {
                                    name: item.namaKomponen
                                }
                            ]
                        }
                    });

                    if (!komponen) {
                        arrayError.push({ error: "komponen tidak ditemukan", konten: item.namaSubKriteria });
                    }

                    const subKomponen = await db.subKomponenLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    komponenLKEId: komponen?.id
                                },
                                {
                                    name: item.namaSubKomponen
                                }
                            ]
                        }
                    });

                    if (!subKomponen) {
                        arrayError.push({ error: "sub komponen tidak ditemukan", konten: item.namaSubKriteria });
                    }

                    const kriteria = await db.kriteriaLKE.findFirst({
                        where: {
                            AND: [
                                {
                                    subKomponenLKEId: subKomponen?.id
                                },
                                {
                                    name: item.namaKriteria
                                }
                            ]
                        }
                    });

                    if (!kriteria) {
                        arrayError.push({ error: "kriteria tidak ditemukan", konten: item.namaSubKriteria });
                    }

                    const subKriteriaLKE = await db.subKriteriaLKE.create({
                        data: {
                            kriteriaLKEId: kriteria?.id,
                            kode: item.kode,
                            name: item.namaSubKriteria,
                            bobot: item.bobot,
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
                            jenisIsian: item.jenisIsian,
                            levelVariabel: "subKriteria",
                            catatanPositif: item.catatanPositif,
                            catatanNegatif: item.catatanNegatif,
                            catatanA: item.catatanA,
                            catatanB: item.catatanB,
                            catatanC: item.catatanC,
                        }
                    })
                } else {
                    arrayError.push({ error: "nama sub kriteria sudah digunakan", konten: item.namaSubKriteria });
                }
            }
        };

        return NextResponse.json({ return: arrayError })

    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
