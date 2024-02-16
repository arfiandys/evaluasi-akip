import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


const LKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const isianLKE = await db.isianLKE.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <div className="flex justify-end">
                <Link href="/koordinator/tim-evaluasi/create">
                    <Button
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Kriteria
                    </Button>
                </Link>
            </div>
            <DataTable data={isianLKE} columns={columns} />
        </div>
    );
}

export default LKEPage;