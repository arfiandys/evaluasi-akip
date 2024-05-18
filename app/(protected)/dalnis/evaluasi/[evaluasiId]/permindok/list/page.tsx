import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { UserRole } from "@prisma/client";


const GeneratePermindokPage = async ({ params }: { params: { evaluasiId: string } }) => {
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

    if (!User) {
        return redirect("/")
    }

    const unitKerja_arr: string[] = []

    User?.unitKerjas.forEach((unit)=>{
        if (unit.assignedRole === UserRole.DALNIS) {
            unitKerja_arr.push(unit.unitKerjaId)
        }        
    })

    const permindokUnitKerja = await db.permindokUnitKerja.findMany({
        where: {
            AND: [
                {
                    permindok: {
                        evaluasiId: params.evaluasiId
                    }
                },
                {
                    unitKerjaId: {in: unitKerja_arr}
                }
            ]
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                permindok: {
                    kode: "asc"
                }
            }
        ],
        include: {
            permindok: true,
            unitKerja: true,
        }
    })

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    interface Items {
        value: string;
        label: string;
    }

    // Unit Kerja
    const dataUnitKerja = Array.from(new Set(permindokUnitKerja.map(item => item.unitKerja.name)))
    const unitKejaUnique: Items[] = dataUnitKerja.map(item => ({
        value: item,
        label: item
    }));

    const data: (Items)[][] = [unitKejaUnique]

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar Permindok Unit Kerja
                        </h1>
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/dalnis/evaluasi`}>Evaluasi</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/dalnis/evaluasi/${params.evaluasiId}/permindok/list`}>Permindok Unit Kerja</Link>
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
            <DataTable data={permindokUnitKerja} columns={columns} uniqueData={data} />
        </div>
    );
}

export default GeneratePermindokPage;