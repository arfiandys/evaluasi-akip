import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


import ImportPage from "./_components/import-page";



const VariabelLKEPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const evaluasi = await db.evaluasi.findUnique({
        where: {
            id: params.evaluasiId
        }
    })

    const variabelLKE = await db.variabelLKE.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            komponenLKE: true,
            subKomponenLKE: true,
            kriteriaLKE: true,
            subKriteriaLKE: true,
            unitKerjas: true,
        }
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar variabel LKE
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
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex justify-end my-4 gap-x-4 space-y-2 flex-wrap">
                    <Button asChild>
                        <Link
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen`}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Kelola variabel LKE
                        </Link>
                    </Button>
                    <ImportPage evaluasi={evaluasi}/>
                </div>
            </div>
            <DataTable data={variabelLKE} columns={columns} />
        </div>
    );
}

export default VariabelLKEPage;