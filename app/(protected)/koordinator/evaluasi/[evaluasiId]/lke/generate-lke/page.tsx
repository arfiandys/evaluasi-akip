import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { DownloadButton } from "./_components/download-button";
import ImportPage from "./_components/import-page";

const LKEPage = async ({
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

    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
        where: {
            variabelLKE: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                variabelLKE: {
                    kode: "asc"
                }
            }
        ],
        include: {
            variabelLKE: {
                include: {
                    komponenLKE: true,
                    subKomponenLKE: true,
                    kriteriaLKE: true,
                    subKriteriaLKE: true,
                }
            },
            unitKerja: true,
        }
    })

    const variabelLKE = await db.variabelLKE.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            kode: "asc",
        },
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    interface Items {
        value: string;
        label: string;
    }

    // Unit Kerja
    const dataUnitKerja = Array.from(new Set(LKEUnitKerja.map(item => item.unitKerja.name)))
    const unitKejaUnique: Items[] = dataUnitKerja.map(item => ({
        value: item,
        label: item
    }));

    const data: (Items)[][] = [unitKejaUnique]

    return (
        <div className="flex h-full flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar LKE
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
                                    <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/generate-lke`}>LKE</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex flex-row justify-center items-center gap-4 gap-y-2 flex-wrap">
                    <DownloadButton data={LKEUnitKerja} />
                    <ImportPage evaluasi={evaluasi}/>
                </div>
            </div>
            <DataTable data={LKEUnitKerja} columns={columns} uniqueData={data} />
        </div>
    );
}

export default LKEPage;