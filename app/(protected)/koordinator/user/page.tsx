import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar pengguna
                        </h1>
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/koordinator/user`}>Pengguna</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex justify-end my-4">
                    <Button asChild>
                        <Link
                            href={`/koordinator/user/new`}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Pengguna baru
                        </Link>
                    </Button>
                </div>
            </div>
            <DataTable data={user} columns={columns} />
        </div>
    );
}

export default UserPage;