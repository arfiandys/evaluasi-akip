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
import KelompokKriteriaNewCreate from "./edit-form";
import { db } from "@/lib/db";

const KelompokKriteriaEditPage = async ({
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


    const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
        where: {
            id: params.kelompokKriteriaId,
        },
        include: {
            kriteriaKKE: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    variabelKKE: true
                }
            },
        },
    });

    if (!kelompokKriteria) {
        return redirect("/");
    }

    const permindok = await db.permindok.findMany({
        where: {
            OR: [
                {
                    id: kelompokKriteria.permindokId!
                },
                {
                    AND: [
                        {
                            kelompokKriteriaKKE: {
                                isNot: {}
                            }

                        },
                        {
                            evaluasiId: params.evaluasiId
                        },
                    ]
                }
            ],
        },
        orderBy: {
            name: "asc",
        },
    });

    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            id: "asc"
        },
    });


    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Edit kelompok kriteria
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
                                    <BreadcrumbPage>Edit kelompok kriteria</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="mt-16 grid gap-6 grid-cols-4">
                    <KelompokKriteriaNewCreate
                        permindok_options={permindok.map((permindok) => ({
                            label: permindok.name,
                            value: permindok.id,
                            data: permindok
                        }))}
                        evaluasi={evaluasi!}
                        kelompokKriteria={kelompokKriteria}
                    />
                </div>
            </div>
        </>
    );
}

export default KelompokKriteriaEditPage;