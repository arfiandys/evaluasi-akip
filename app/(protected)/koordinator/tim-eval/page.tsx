import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";


const TimEvaluasiPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const timEvaluasi = await db.timEvaluasi.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            userTim: {
                orderBy: {
                    name: "asc"
                }
            }
        }
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={timEvaluasi} />
        </div>
    );
}

export default TimEvaluasiPage;