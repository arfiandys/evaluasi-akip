import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


const UserPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const user = await db.user.findMany({
        orderBy: {
            id: "desc",
        },
        include: {
            unitKerjas: true,
            timEvaluasis: true,
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <div className="flex justify-end">
                <Link href="/koordinator/user/create">
                    <Button
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New user
                    </Button>
                </Link>
            </div>
            <DataTable data={user} columns={columns} />
        </div>
    );
}

export default UserPage;