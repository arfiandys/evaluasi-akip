import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreatePage from "./_components/create-form";


const SubKomponenLKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const subKomponenLKE = await db.subKomponenLKE.findMany({
        orderBy: {
            name: "asc",
        },
        include: {
            kriteriaLKE: {
                orderBy: {
                    name: "asc"
                }
            }
        }
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-8 p-8">
            <CreatePage />
            <DataTable data={subKomponenLKE} columns={columns} />
        </div>
    );
}

export default SubKomponenLKEPage;