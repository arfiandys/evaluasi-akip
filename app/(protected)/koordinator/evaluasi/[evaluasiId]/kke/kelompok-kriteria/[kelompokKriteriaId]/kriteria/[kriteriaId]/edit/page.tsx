import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import SubKomponenNewCreate from "./edit-form";
import KriteriaEdit from "./edit-form";
import { db } from "@/lib/db";

const KriteriaEditPage = async ({
    params
}: {
    params: { evaluasiId: string, kelompokKriteriaId: string, kriteriaId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const evaluasi = await db.evaluasi.findUnique({
        where: {
            id: params.evaluasiId
        },
    })

    const kriteriaKKE = await db.kriteriaKKE.findUnique({
        where: {
            id: params.kriteriaId,
        },
        include: {
            variabelKKE: {
                include: {
                    tujuanSasaranIndikatorIKUVariabelKKE: true
                }
            }
        }
    });

    if (!kriteriaKKE) {
        return redirect("/");
    }

    const variabelLKE = await db.variabelLKE.findMany({
        where: {
            OR: [
                {
                    variabelKKE: {
                        id: kriteriaKKE.variabelKKE!.id
                    }
                },
                {
                    AND: [
                        {
                            evaluasiId: params.evaluasiId
                        },
                        {
                            variabelKKE: {
                                is: null
                            }
                        },
                        {
                            OR: [
                                {
                                    levelVariabel: "kriteria",
                                },
                                {
                                    levelVariabel: "subKriteria",
                                },
                            ],
                        }
                    ]
                },
            ]
        },
        orderBy: {
            id: "asc"
        }
    })

    const variabelLKE_IK = await db.variabelLKE.findMany({
        where: {
            OR: [
                {
                    AND: [
                        {
                            variabelKKE: {
                                id: kriteriaKKE.variabelKKE!.id
                            }
                        },
                        {
                            jenisIsian: "number"
                        }
                    ]
                },
                {
                    AND: [
                        {
                            evaluasiId: params.evaluasiId
                        },
                        {
                            variabelKKE: {
                                is: null
                            }
                        },
                        {
                            jenisIsian: "number"
                        },
                        {
                            OR: [
                                {
                                    levelVariabel: "kriteria",
                                },
                                {
                                    levelVariabel: "subKriteria",
                                },
                            ],
                        }
                    ]
                }
            ]

        },
        orderBy: {
            id: "asc"
        }
    })

    const IKU = await db.iKU.findMany({
        orderBy: {
            id: "asc"
        },
        include: {
            tujuanSasaranIndikatorIKU: true
        }
    })

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Edit kriteria
                            </h1>
                        </div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi`}>Evaluasi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/kke/variabel`}>Variabel KKE</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria`}>Kelompok kriteria</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria/${params.kelompokKriteriaId}`}>Kriteria</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit kriteria</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="mt-16 grid gap-6 grid-cols-4">
                    <KriteriaEdit evaluasi={evaluasi!} kelompokKriteriaId={params.kelompokKriteriaId}
                        variabelLKE_options_ED={variabelLKE.map((variabel) => ({
                            label: variabel.kode,
                            value: variabel.id,
                            data: variabel
                        }))}
                        variabelLKE_options_IK={variabelLKE_IK.map((variabel) => ({
                            label: variabel.kode,
                            value: variabel.id,
                            data: variabel
                        }))}

                        IKU_options={IKU.map((iku) => ({
                            label: iku.name,
                            value: iku.id,
                            data: iku
                        }))}

                        kriteria={kriteriaKKE}
                    />
                </div>
            </div>
        </>
    );
}

export default KriteriaEditPage;