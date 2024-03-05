import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateIKUPage from "./_components/create-form";


const IKUPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const IKU = await db.iKU.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <CreateIKUPage />
            <DataTable data={IKU} columns={columns} />
        </div>
    );
}

export default IKUPage;