import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns, columnsIndikatorKinerja } from "./_components/columns";
import { UserRole } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";

const KKEAnggotaPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const User = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            unitKerjas: true
        }
    })

    const unitKerja_arr: string[] = []

    User?.unitKerjas.forEach((unit) => {
        if (unit.assignedRole === UserRole.PIC) {
            unitKerja_arr.push(unit.unitKerjaId)
        }
    })
    console.log(unitKerja_arr)

    // Indikator Kinerja
    const VariabelKKIndikatorUnitKerja = await db.variabelKKEUnitKerja.findMany({
        where: {
            AND: [
                {
                    unitKerjaId: {
                        in: unitKerja_arr
                    }
                },
                {
                    variabelKKE: {
                        isIndikatorKinerja: true
                    }
                },
                {
                    variabelKKE: {
                        evaluasiId: params.evaluasiId
                    }
                }
            ]
        },
        orderBy: {
            variabelKKE: {
                kode: "asc"
            }
        },
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: {
                        include: {
                            kelompokKriteriaKKE: true
                        }
                    },
                    evaluasi: true
                }
            },
            unitKerja: {
                include: {
                    permindoks: true
                }
            },
        }
    })
    // Evaluasi Dokumen
    const VariabelKKEvaluasiUnitKerja = await db.variabelKKEUnitKerja.findMany({
        where: {
            AND: [
                {
                    unitKerjaId: {
                        in: unitKerja_arr
                    }
                },
                {
                    variabelKKE: {
                        isIndikatorKinerja: false
                    }
                },
                {
                    variabelKKE: {
                        evaluasiId: params.evaluasiId
                    }
                }
            ]
        },
        orderBy: {
            variabelKKE: {
                kode: "asc"
            }
        },
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: {
                        include: {
                            kelompokKriteriaKKE: true
                        }
                    },
                    evaluasi: true
                }
            },
            unitKerja: {
                include: {
                    permindoks: true
                }
            },
        }
    })

    interface Items {
        value: string;
        label: string;
    }

    // Unit Kerja
    const dataUnitKerja = Array.from(new Set(VariabelKKIndikatorUnitKerja.map(item => item.unitKerja.name)))
    const unitKejaUnique: Items[] = dataUnitKerja.map(item => ({
        value: item,
        label: item
    }));

    const data:(Items)[][] = [unitKejaUnique]

    return (
        <div className="flex h-full flex-1 flex-col space-y-6 p-8">
        <div className="flex flex-row gap-x-2 justify-between">
            <div className="flex flex-col gap-y-2 justify-between">
                <div className="">
                    <h1 className="text-2xl font-medium">
                        Daftar variabel KKE
                    </h1>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={`/pic/evaluasi`}>Evaluasi</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={`/pic/evaluasi/${params.evaluasiId}/kke/list`}>Variabel KKE</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Daftar</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
        <Tabs defaultValue="evaluasi">
                <TabsList>
                    <TabsTrigger value="evaluasi">KK Evaluasi Dokumen</TabsTrigger>
                    <TabsTrigger value="indikator">KK Indikator Kinerja</TabsTrigger>
                </TabsList>
                <TabsContent value="evaluasi">
                    <DataTable data={VariabelKKEvaluasiUnitKerja} columns={columns} uniqueData={data} />
                </TabsContent>
                <TabsContent value="indikator">
                    <DataTable data={VariabelKKIndikatorUnitKerja} columns={columnsIndikatorKinerja} uniqueData={data} />
                </TabsContent>
            </Tabs>
    </div>
    );
}

export default KKEAnggotaPage;