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
            tahun: "asc"
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

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <GeneratePage variabelLKE={variabelLKE} unitKerja={unitKerja}/>
            <DataTable data={LKEUnitKerja} columns={columns} />
        </div>
    );
}

export default GenerateLKEPage;