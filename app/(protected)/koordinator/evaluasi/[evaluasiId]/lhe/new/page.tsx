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
import { db } from "@/lib/db";
import Create from "./create-form";
import { PDF } from "../_component/lhe-pdf";

const PermindokNewPage = async ({
    params
}: {
    params: { evaluasiId: string }
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

    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
        where: {
            variabelLKE: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                variabelLKE: {
                    kode: "asc"
                }
            }
        ],
        include: {
            variabelLKE: {
                include: {
                    komponenLKE: true,
                    subKomponenLKE: true,
                    kriteriaLKE: true,
                    subKriteriaLKE: true,
                }
            },
            unitKerja: true,
        }
    })

    const LKEUnitKerjaCatatan = await db.lKEUnitKerja.findMany({
        where: {
            AND: [
                {
                    variabelLKE: {
                        evaluasiId: params.evaluasiId
                    }
                },
                {
                    catatanPanel: {
                        not: null
                    }
                },
                {
                    catatanPanel: {
                        not: ""
                    }
                },
                {
                    catatanPanel: {
                        not: undefined
                    }
                },
                {
                    OR: [
                        {
                            variabelLKE: {
                                levelVariabel: "kriteria"
                            }
                        },
                        {
                            variabelLKE: {
                                levelVariabel: "subKriteria"
                            }
                        }
                    ]
                },
            ]
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                variabelLKE: {
                    kode: "asc"
                }
            }
        ],
        include: {
            variabelLKE: {
                include: {
                    komponenLKE: true,
                    subKomponenLKE: true,
                    kriteriaLKE: {
                        include: {
                            subKomponenLKE: {
                                include: {
                                    komponenLKE: true
                                }
                            }
                        }
                    },
                    subKriteriaLKE: {
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
                    },
                }
            },
            unitKerja: true,
        }
    })

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Membuat LHE baru
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
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lhe`}>LHE</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>LHE baru</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="mt-16 grid gap-6 grid-cols-4">
                    <Create evaluasi={evaluasi!} unitKerja={unitKerja} LKEUnitKerja={LKEUnitKerja} dataCatatan={LKEUnitKerjaCatatan} />
                </div>
            </div>
        </>
    );
}

export default PermindokNewPage;