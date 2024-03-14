import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { UserRole } from "@prisma/client";


const IKUAnggotaPage = async () => {
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

    const VariabelIKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
            unitKerjaId: {in: unitKerja_arr}
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

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable data={VariabelIKUUnitKerja} columns={columns} />
        </div>
    );
}

export default IKUAnggotaPage;