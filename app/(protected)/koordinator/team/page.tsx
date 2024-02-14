import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
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
    const teams = await db.team.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={teams} />
        </div>
    );
}

export default TimEvaluasiPage;