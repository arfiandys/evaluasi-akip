import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { UserRole } from "@prisma/client";


const LKEAnggotaPage = async () => {
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
        if (unit.assignedRole === UserRole.KETUA) {
            unitKerja_arr.push(unit.unitKerjaId)
        }        
    })
    console.log(unitKerja_arr)
    
    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
        where: {
            unitKerjaId: {in: unitKerja_arr}
        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            variabelLKE: {
                include: {
                    kriteriaLKE: true,
                    subKriteriaLKE: true,
                }
            },
            unitKerja: true,
        }
    })


    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable data={LKEUnitKerja} columns={columns} />
        </div>
    );
}

export default LKEAnggotaPage;