import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns, columnsIndikatorKinerja } from "./_components/columns";
import { UserRole } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



const KKEAnggotaPage = async () => {
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
        if (unit.assignedRole === UserRole.ANGGOTA) {
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
                }
            ]
        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: {
                        include: {
                            kelompokKriteriaKKE: true
                        }
                    },
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
                }
            ]
        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: {
                        include: {
                            kelompokKriteriaKKE: true
                        }
                    },
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

    // Tahun
    const dataTahun = Array.from(new Set(VariabelKKIndikatorUnitKerja.map(item => item.tahun.toString())))
    const tahunUnique: Items[] = dataTahun.map(item => ({
        value: item,
        label: item
    }));

    // Unit Kerja
    const dataUnitKerja = Array.from(new Set(VariabelKKIndikatorUnitKerja.map(item => item.unitKerja.name)))
    const unitKejaUnique: Items[] = dataUnitKerja.map(item => ({
        value: item,
        label: item
    }));

    const data:(Items)[][] = [tahunUnique,unitKejaUnique]

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
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