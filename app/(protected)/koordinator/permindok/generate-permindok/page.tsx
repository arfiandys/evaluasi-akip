import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_components/generate-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";


const GeneratePermindokPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const permindokUnitKerja = await db.permindokUnitKerja.findMany({
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            permindok: true,
            unitKerja: true,
        }
    })

    const permindok = await db.permindok.findMany({
        orderBy: {
            kode: "asc",
        },
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <GeneratePage permindok={permindok} unitKerja={unitKerja}/>
            <DataTable data={permindokUnitKerja} columns={columns} />
        </div>
    );
}

export default GeneratePermindokPage;