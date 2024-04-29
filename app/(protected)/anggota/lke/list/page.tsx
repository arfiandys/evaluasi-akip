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
        if (unit.assignedRole === UserRole.ANGGOTA) {
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
    const dataTahun = Array.from(new Set(LKEUnitKerja.map(item => item.tahun)))
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
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <DataTable data={LKEUnitKerja} columns={columns} uniqueData={data} />
        </div>
    );
}

export default LKEAnggotaPage;