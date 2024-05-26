import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const IKUPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const IKU = await db.iKU.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            name: "asc",
        },
        include: {
            tujuanSasaranIndikatorIKU: true
        }
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
        <div className="flex flex-row gap-x-2 justify-between">
            <div className="flex flex-col gap-y-2 justify-between">
                <div className="">
                    <h1 className="text-2xl font-medium">
                        Daftar Indikator Kinerja Utama
                    </h1>
                </div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={`/koordinator/evaluasi`}>Evaluasi</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={`/koordinator/evaluasi/${params.evaluasiId}/iku`}>IKU</Link>
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
                        href={`/koordinator/evaluasi/${params.evaluasiId}/iku/new`}
                    >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        IKU baru
                    </Link>
                </Button>
            </div>
        </div>
        <DataTable data={IKU} columns={columns} />
    </div>
    );
}

export default IKUPage;