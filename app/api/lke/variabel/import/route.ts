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
            if (item.level === "komponen") {
                const komponenLKE = await db.komponenLKE.create({
                    data: {
                        kode: item.kode,
                        tahun: values.tahun,
                        name: item.namaKomponen,
                        bobot: item.bobot,
                    }
                })

                const variabelLKE = await db.variabelLKE.create({
                    data: {
                        evaluasiId: values.evaluasiId,
                        komponenLKEId: komponenLKE.id,
                        kode: komponenLKE.kode || "",
                        tahun: komponenLKE.tahun || "",
                        jenisIsian: "number",
                        levelVariabel: "komponen",
                    }
                })
            }

            if (item.level === "subKomponen") {
                const komponen = await db.komponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                tahun: values.tahun
                            },
                            {
                                name: item.namaKomponen
                            }
                        ]
                    }
                });

                if (!komponen) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const subKomponenLKE = await db.subKomponenLKE.create({
                    data: {
                        komponenLKEId: komponen.id,
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
                        tahun: subKomponenLKE.komponenLKE?.tahun || "",
                        jenisIsian: "number",
                        levelVariabel: "subKomponen",
                    }
                })
            }

            if (item.level === "kriteria") {

                const komponen = await db.komponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                tahun: values.tahun
                            },
                            {
                                name: item.namaKomponen
                            }
                        ]
                    }
                });

                if (!komponen) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const subKomponen = await db.subKomponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                komponenLKEId: komponen.id
                            },
                            {
                                name: item.namaSubKomponen
                            }
                        ]
                    }
                });

                if (!subKomponen) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const kriteriaLKE = await db.kriteriaLKE.create({
                    data: {
                        subKomponenLKEId: subKomponen.id,
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
                        tahun: kriteriaLKE.subKomponenLKE?.komponenLKE?.tahun || "",
                        jenisIsian: item.jenisIsian,
                        levelVariabel: "kriteria",
                        catatanPositif: item.catatanPositif,
                        catatanNegatif: item.catatanNegatif,
                        catatanA: item.catatanA,
                        catatanB: item.catatanB,
                        catatanC: item.catatanC,
                    }
                })
            }

            if (item.level === "subKriteria") {

                const komponen = await db.komponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                tahun: values.tahun
                            },
                            {
                                name: item.namaKomponen
                            }
                        ]
                    }
                });

                if (!komponen) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const subKomponen = await db.subKomponenLKE.findFirst({
                    where: {
                        AND: [
                            {
                                komponenLKEId: komponen.id
                            },
                            {
                                name: item.namaSubKomponen
                            }
                        ]
                    }
                });

                if (!subKomponen) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const kriteria = await db.kriteriaLKE.findFirst({
                    where: {
                        AND: [
                            {
                                subKomponenLKEId: subKomponen.id
                            },
                            {
                                name: item.namaKriteria
                            }
                        ]
                    }
                });

                if (!kriteria) {
                    return new NextResponse("Unauthorized", { status: 401 });
                }

                const subKriteriaLKE = await db.subKriteriaLKE.create({
                    data: {
                        kriteriaLKEId: kriteria.id,
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
                        tahun: subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.komponenLKE?.tahun || "",
                        jenisIsian: item.jenisIsian,
                        levelVariabel: "subKriteria",
                        catatanPositif: item.catatanPositif,
                        catatanNegatif: item.catatanNegatif,
                        catatanA: item.catatanA,
                        catatanB: item.catatanB,
                        catatanC: item.catatanC,
                    }
                })
            }
        };

        return NextResponse.json("Level Not Found")
        
    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


    // if (values.level === "komponen") {
    //     const komponenLKE = await db.komponenLKE.create({
    //         data: {
    //             kode: values.kode,
    //             tahun: values.tahun,
    //             name: values.namaKomponen,
    //             bobot: values.bobot,
    //         }
    //     })

    //     const variabelLKE = await db.variabelLKE.create({
    //         data: {
    //             evaluasiId: values.evaluasiId,
    //             komponenLKEId: komponenLKE.id,
    //             kode: komponenLKE.kode || "",
    //             tahun: komponenLKE.tahun || "",
    //             jenisIsian: "number",
    //             levelVariabel: "komponen",
    //         }
    //     })

    //     return NextResponse.json(variabelLKE);
    // }

    // if (values.level === "subKomponen") {
    //     const komponen = await db.komponenLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     tahun: values.tahun
    //                 },
    //                 {
    //                     name: values.namaKomponen
    //                 }
    //             ]
    //         }
    //     });

    //     if (!komponen) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const subKomponenLKE = await db.subKomponenLKE.create({
    //         data: {
    //             komponenLKEId: komponen.id,
    //             kode: values.kode,
    //             name: values.namaSubKomponen,
    //             bobot: values.bobot,
    //         },
    //         include: {
    //             komponenLKE: true
    //         }
    //     })

    //     const variabelLKE = await db.variabelLKE.create({
    //         data: {
    //             evaluasiId: values.evaluasiId,
    //             subKomponenLKEId: subKomponenLKE.id,
    //             kode: subKomponenLKE.komponenLKE?.kode.concat(".", subKomponenLKE.kode) || "",
    //             tahun: subKomponenLKE.komponenLKE?.tahun || "",
    //             jenisIsian: "number",
    //             levelVariabel: "subKomponen",
    //         }
    //     })

    //     return NextResponse.json(variabelLKE);
    // }

    // if (values.level === "kriteria") {

    //     const komponen = await db.komponenLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     tahun: values.tahun
    //                 },
    //                 {
    //                     name: values.namaKomponen
    //                 }
    //             ]
    //         }
    //     });

    //     if (!komponen) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const subKomponen = await db.subKomponenLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     komponenLKEId: komponen.id
    //                 },
    //                 {
    //                     name: values.namaSubKomponen
    //                 }
    //             ]
    //         }
    //     });

    //     if (!subKomponen) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const kriteriaLKE = await db.kriteriaLKE.create({
    //         data: {
    //             subKomponenLKEId: subKomponen.id,
    //             kode: values.kode,
    //             name: values.namaKriteria,
    //             bobot: values.bobot,
    //         },
    //         include: {
    //             subKomponenLKE: {
    //                 include: {
    //                     komponenLKE: true
    //                 }
    //             }
    //         }
    //     })

    //     const variabelLKE = await db.variabelLKE.create({
    //         data: {
    //             evaluasiId: values.evaluasiId,
    //             kriteriaLKEId: kriteriaLKE.id,
    //             kode: kriteriaLKE.subKomponenLKE?.komponenLKE?.kode.concat(".", kriteriaLKE?.subKomponenLKE?.kode.concat(".", kriteriaLKE?.kode)) || "",
    //             tahun: kriteriaLKE.subKomponenLKE?.komponenLKE?.tahun || "",
    //             jenisIsian: values.jenisIsian,
    //             levelVariabel: "kriteria",
    //             catatanPositif: values.catatanPositif,
    //             catatanNegatif: values.catatanNegatif,
    //             catatanA: values.catatanA,
    //             catatanB: values.catatanB,
    //             catatanC: values.catatanC,
    //         }
    //     })

    //     return NextResponse.json(variabelLKE);
    // }

    // if (values.level === "subKriteria") {

    //     const komponen = await db.komponenLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     tahun: values.tahun
    //                 },
    //                 {
    //                     name: values.namaKomponen
    //                 }
    //             ]
    //         }
    //     });

    //     if (!komponen) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const subKomponen = await db.subKomponenLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     komponenLKEId: komponen.id
    //                 },
    //                 {
    //                     name: values.namaSubKomponen
    //                 }
    //             ]
    //         }
    //     });

    //     if (!subKomponen) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const kriteria = await db.kriteriaLKE.findFirst({
    //         where: {
    //             AND: [
    //                 {
    //                     subKomponenLKEId: subKomponen.id
    //                 },
    //                 {
    //                     name: values.namaKriteria
    //                 }
    //             ]
    //         }
    //     });

    //     if (!kriteria) {
    //         return new NextResponse("Unauthorized", { status: 401 });
    //     }

    //     const subKriteriaLKE = await db.subKriteriaLKE.create({
    //         data: {
    //             kriteriaLKEId: kriteria.id,
    //             kode: values.kode,
    //             name: values.namaSubKriteria,
    //             bobot: values.bobot,
    //         },
    //         include: {
    //             kriteriaLKE: {
    //                 include: {
    //                     subKomponenLKE: {
    //                         include: {
    //                             komponenLKE: true
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     })

    //     const variabelLKE = await db.variabelLKE.create({
    //         data: {
    //             evaluasiId: values.evaluasiId,
    //             subKriteriaLKEId: subKriteriaLKE.id,
    //             kode: subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.komponenLKE?.kode.concat(".", subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.kode.concat(".", subKriteriaLKE.kriteriaLKE?.kode.concat(".", subKriteriaLKE.kode))) || "",
    //             tahun: subKriteriaLKE.kriteriaLKE?.subKomponenLKE?.komponenLKE?.tahun || "",
    //             jenisIsian: values.jenisIsian,
    //             levelVariabel: "subKriteria",
    //             catatanPositif: values.catatanPositif,
    //             catatanNegatif: values.catatanNegatif,
    //             catatanA: values.catatanA,
    //             catatanB: values.catatanB,
    //             catatanC: values.catatanC,
    //         }
    //     })

    //     return NextResponse.json(variabelLKE);
    // }