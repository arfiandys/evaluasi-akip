import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateTimEvaluasiPage from "./_components/create-form";


const TimEvaluasiPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const timEvaluasi = await db.timEvaluasi.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            users: {
                orderBy: {
                    userId: "asc"
                },
                include: {
                    user: {
                        include: {
                            unitKerjas: true
                        }
                    }
                }
            }
        }
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <CreateTimEvaluasiPage />
            <DataTable data={timEvaluasi} columns={columns} />
        </div>
    );
}

export default TimEvaluasiPage;