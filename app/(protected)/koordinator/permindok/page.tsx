import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreatePermindokPage from "./_components/create-form";


const PermindokPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const permindok = await db.permindok.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <CreatePermindokPage />
            <DataTable data={permindok} columns={columns} />
        </div>
    );
}

export default PermindokPage;