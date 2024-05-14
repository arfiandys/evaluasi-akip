import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { UserRole } from "@prisma/client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";

const LKEAnggotaPage = async ({
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

    User?.unitKerjas.forEach((unit)=>{
        if (unit.assignedRole === UserRole.ANGGOTA) {
            unitKerja_arr.push(unit.unitKerjaId)
        }        
    })
    console.log(unitKerja_arr)
    
    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
        where: {
            AND: [
                {
                    variabelLKE: {
                        evaluasiId: params.evaluasiId
                    }
                },
                {
                    unitKerjaId: {in: unitKerja_arr}
                }
            ]
        },
        orderBy: {
            variabelLKE: {
                kode: "asc"
            }
        },
        include: {
            variabelLKE: {
                include: {
                    komponenLKE: true,
                    subKomponenLKE: true,
                    kriteriaLKE: {
                        include: {
                            subKriteriaLKE: true
                        }
                    },
                    subKriteriaLKE: true,
                    variabelKKE: true,
                }
            },
            unitKerja: true,
        }
    })

    interface Items {
        value: string;
        label: string;
    }

    // Tahun
    const dataTahun = Array.from(new Set(LKEUnitKerja.map(item => item.variabelLKE.tahun)))
    const tahunUnique: Items[] = dataTahun.map(item => ({
        value: item,
        label: item
    }));

    // Unit Kerja
    const dataUnitKerja = Array.from(new Set(LKEUnitKerja.map(item => item.unitKerja.name)))
    const unitKejaUnique: Items[] = dataUnitKerja.map(item => ({
        value: item,
        label: item
    }));

    const data:(Items)[][] = [tahunUnique,unitKejaUnique]


    return (
        <div className="flex h-full flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar variabel LKE
                        </h1>
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/anggota/evaluasi`}>Evaluasi</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/anggota/evaluasi/${params.evaluasiId}/lke/list`}>Variabel LKE</Link>
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
            <DataTable data={LKEUnitKerja} columns={columns} uniqueData={data} />
        </div>
    );
}

export default LKEAnggotaPage;