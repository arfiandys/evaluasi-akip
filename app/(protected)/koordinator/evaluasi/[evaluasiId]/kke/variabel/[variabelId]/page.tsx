import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { ArrowLeft } from "lucide-react";


const VariabelKKEIKUPage = async ({
    params
}: {
    params: { evaluasiId: string, variabelId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const variabelIKU = await db.tujuanSasaranIndikatorIKUVariabelKKE.findMany({
        where: {
            AND: [
                {
                    variabelKKEId: params.variabelId
                },
                {
                    variabelKKE: {
                        evaluasiId: params.evaluasiId
                    }
                }
            ]
        },
        orderBy: {
            id: "asc",
        },
        include: {
            tujuanSasaranIndikatorIKU: {
                include: {
                    IKU: true
                }
            },
            variabelKKE: {
                include: {
                    kriteriaKKE: true
                }
            },
            tujuanSasaranIndikatorIKUUnitKerja: true,
        }
    });

    const variabelKKE = await db.variabelKKE.findUnique({
        where: {
            id: params.variabelId
        },
        include: {
            kriteriaKKE: true
        }
    });

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/koordinator/evaluasi/${params.evaluasiId}/kke/variabel`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar variabel KKE
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail variabel KKE
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" mt-16">
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail variabel KKE</CardTitle>
                                <CardDescription>Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Kode
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {variabelKKE?.kode}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Nama
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {variabelKKE?.kriteriaKKE?.nama}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Jenis Kertas Kerja
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {(variabelKKE?.isIndikatorKinerja === true) ? "KK Indikator Kinerja" : "KK Evaluasi Dokumen"}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Jenis Isian Variabel
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {variabelKKE?.jenisIsian}
                                        </p>
                                    </div>
                                </div>
                                {(variabelKKE?.isIndikatorKinerja === true) ? (

                                    <div
                                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                    >
                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                Jenis Isian IKU
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {variabelKKE?.jenisIsianIKU}
                                            </p>
                                        </div>
                                    </div>
                                ) : (<></>)
                                }
                            </CardContent>
                        </Card>
                        {(variabelKKE?.isIndikatorKinerja === true) ? (
                            < Card className="shadow-lg col-span-3">
                                <CardHeader className="flex flex-row justify-between">
                                    <div>
                                        <CardTitle>IKU</CardTitle>
                                        <CardDescription>Card Description</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <DataTable data={variabelIKU} columns={columns} />
                                </CardContent>
                            </Card>
                        ) : (<></>)
                        }
                    </div>
                </div>
            </div >
        </>
    );
}

export default VariabelKKEIKUPage;