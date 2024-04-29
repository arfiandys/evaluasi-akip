import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


const IKUAnggotaPage = async ({
    params
}: {
    params: { variabelKKEId: string }
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
        if (unit.assignedRole === UserRole.ANGGOTA) {
            unitKerja_arr.push(unit.unitKerjaId)
        }
    })
    console.log(unitKerja_arr)

    const VariabelIKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
            AND: [
                { unitKerjaId: { in: unitKerja_arr } },
                {
                    tujuanSasaranIndikatorIKUVariabelKKE: {
                        variabelKKEId: params.variabelKKEId
                    }
                }
            ]

        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                include: {
                    tujuanSasaranIndikatorIKU: true,
                    variabelKKE: true
                }
            },
            unitKerja: true,
        }
    })

    const namaVariabelKKE = await db.variabelKKE.findUnique({
        where: {
            id: params.variabelKKEId
        }
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <Link
                href={`/anggota/kke/list`}
                className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to daftar KKE
            </Link>
            <DataTable data={VariabelIKUUnitKerja} columns={columns} nama={namaVariabelKKE?.nama} />
        </div>
    );
}

export default IKUAnggotaPage;