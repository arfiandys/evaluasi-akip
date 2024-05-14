import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const KomponenPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const komponen = await db.komponenLKE.findMany({
        where: {
            variabelLKE: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            subKomponenLKE: {
                orderBy: {
                    name: "asc"
                }
            },
            variabelLKE: true
        },
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar komponen
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
                                    <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/variabel`}>Variabel LKE</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen`}>Komponen</Link>
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/new`}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Komponen baru
                        </Link>
                    </Button>
                </div>
            </div>
            <DataTable data={komponen} columns={columns} />
        </div>
    );
}

export default KomponenPage;