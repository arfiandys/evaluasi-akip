import { DataTable } from "./_components/data-table";
import { columns } from "./_components/column";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";


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
            users: {
                orderBy: {
                    userId: "asc"
                }
            }
        }
    });

    return (
        <div className="p-6 flex flex-col">
            <div className="flex justify-end">
                <Link href="/koordinator/tim-eval/create">
                    <Button
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New tim evaluasi
                    </Button>
                </Link>
            </div>
            <DataTable columns={columns} data={timEvaluasi} />
        </div>
    );
}

export default TimEvaluasiPage;