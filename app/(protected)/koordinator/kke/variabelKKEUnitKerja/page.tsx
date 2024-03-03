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

    const VariabelKKEUnitKerja = await db.variabelKKEUnitKerja.findMany({
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: true,
                }
            },
            unitKerja: true,
        }
    })

    const variabelKKE = await db.variabelKKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaKKE: true,
        }
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <GeneratePage variabelKKE={variabelKKE} unitKerja={unitKerja}/>
            <DataTable data={VariabelKKEUnitKerja} columns={columns} />
        </div>
    );
}

export default GenerateLKEPage;