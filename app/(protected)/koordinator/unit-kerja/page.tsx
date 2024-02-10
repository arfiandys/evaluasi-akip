import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const UnitKerjaPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const unitKerja = await db.unitKerja.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            users: {
                include: {
                    user: true
                }
            }
        }
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={unitKerja} />
        </div>
    );
}

export default UnitKerjaPage;