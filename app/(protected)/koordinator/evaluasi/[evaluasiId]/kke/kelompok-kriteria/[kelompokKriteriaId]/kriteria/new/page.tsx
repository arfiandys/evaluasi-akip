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
import SubKomponenNewCreate from "./create-form";
import KriteriaNewCreate from "./create-form";
import { db } from "@/lib/db";

const KriteriaNewPage = async ({
    params
}: {
    params: { evaluasiId: string, kelompokKriteriaId: string }
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

    const variabelLKE = await db.variabelLKE.findMany({
        where: {
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
        orderBy: {
            id: "asc"
        }
    })

    const variabelLKE_IK = await db.variabelLKE.findMany({
        where: {
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
                                Membuat kriteria baru
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
                                    <BreadcrumbPage>Kriteria baru</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-16">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h2 className="text-xl font-medium">
                                    Detail
                                </h2>
                                <span className="text-sm text-secondary-foreground">
                                    Nama, kode, petunjuk...
                                </span>
                            </div>
                        </div>
                    </div>
                    <KriteriaNewCreate evaluasi={evaluasi!} kelompokKriteriaId={params.kelompokKriteriaId}
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
                    />
                </div>
            </div>
        </>
    );
}

export default KriteriaNewPage;