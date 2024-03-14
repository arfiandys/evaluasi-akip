import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { UserRole } from "@prisma/client";


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

    User?.unitKerjas.forEach((unit)=>{
        if (unit.assignedRole === UserRole.DALNIS) {
            unitKerja_arr.push(unit.unitKerjaId)
        }        
    })
    console.log(unitKerja_arr)

    const VariabelKKEUnitKerja = await db.variabelKKEUnitKerja.findMany({
        where: {
            unitKerjaId: {in: unitKerja_arr}
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

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable data={VariabelKKEUnitKerja} columns={columns} />
        </div>
    );
}

export default KKEAnggotaPage;