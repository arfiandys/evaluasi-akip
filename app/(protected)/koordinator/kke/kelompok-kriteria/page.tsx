import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateKolompokKriteriaPage from "./_components/create-form";


const KelompokKriteriaPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const kelompokKriteria = await db.kelompokKriteriaKKE.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            kriteriaKKE: {
                orderBy: {
                    name: "asc"
                }
            }
        }
    });

    const permindok = await db.permindok.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <CreateKolompokKriteriaPage
                permindok_options={permindok.map((permindok) => ({
                    label: permindok.name,
                    value: permindok.id,
                    data: permindok
                }))}
            />
            <DataTable data={kelompokKriteria} columns={columns} />
        </div>
    );
}

export default KelompokKriteriaPage;