import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateKomponenPage from "./_components/create-form";


const KomponenPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const komponen = await db.komponenLKE.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            subKomponenLKE: {
                orderBy: {
                    name: "asc"
                }
            }
        }
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <CreateKomponenPage />
            <DataTable data={komponen} columns={columns} />
        </div>
    );
}

export default KomponenPage;