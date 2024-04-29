import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_components/generate-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";


const GenerateLKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
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

    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaLKE: true,
            subKriteriaLKE: true,
        }
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

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
            <GeneratePage variabelLKE={variabelLKE} unitKerja={unitKerja}/>
            <DataTable data={LKEUnitKerja} columns={columns} uniqueData={data}/>
        </div>
    );
}

export default GenerateLKEPage;