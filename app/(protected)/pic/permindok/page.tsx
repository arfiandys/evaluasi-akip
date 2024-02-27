import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_components/generate-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { UserRole } from "@prisma/client";


const PermindokPage = async () => {
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
        if (unit.assignedRole === UserRole.PIC) {
            unitKerja_arr.push(unit.unitKerjaId)
        }        
    })
    console.log(unitKerja_arr)

    const permindokUnitKerja = await db.permindokUnitKerja.findMany({
        where: {
            unitKerjaId: {in: unitKerja_arr}
        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            permindok: true,
            unitKerja: true,
        }
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable data={permindokUnitKerja} columns={columns} />
        </div>
    );
}

export default PermindokPage;