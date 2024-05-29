import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, Edit, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { DataTable } from "./tujuanSasaranIndikator/_components/data-table";
import { columns } from "./tujuanSasaranIndikator/_components/columns";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ImportPage from "./_components/import-page";

const IKUIdPage = async ({
    params
}: {
    params: { evaluasiId: string, ikuId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const IKU = await db.iKU.findUnique({
        where: {
            id: params.ikuId,
        },
        include: {
            tujuanSasaranIndikatorIKU: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    IKU: true
                }
            },
        },
    });

    if (!IKU) {
        return redirect("/");
    }

    const evaluasi = await db.evaluasi.findUnique({
        where: {
            id: params.evaluasiId,
        },
    });

    if (!evaluasi) {
        return redirect("/");
    }

    const requiredFields = [
        IKU.name,
        IKU.tujuanSasaranIndikatorIKU.length
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/koordinator/evaluasi/${params.evaluasiId}/iku`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar IKU
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian Indikator Kinerja Utama
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                evaluasiId={params.evaluasiId}
                                disabled={!isComplete}
                                IKUId={params.ikuId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16 grid gap-6 grid-cols-4">
                    <Card className="shadow-lg col-span-4 xl:col-span-1 rounded-3xl">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Activity} />
                                <CardTitle>Rincian dasar</CardTitle>
                            </div>
                            <Button asChild variant="ghost">
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/iku/${params.ikuId}/edit`}
                                >
                                    <Edit />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="my-3 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Nama
                                    </p>
                                    <p className="text-sm text-muted-foreground text-wrap">
                                        {IKU.name}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg col-span-4 xl:col-span-3 rounded-3xl">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center gap-y-2 flex-wrap">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={ListTree} />
                                <CardTitle>Tujuan / Sasaran / Indikator</CardTitle>
                            </div>
                            <div className="flex flex-row flex-wrap justify-end gap-4">
                                <Button asChild>
                                    <Link
                                        href={`/koordinator/evaluasi/${params.evaluasiId}/iku/${params.ikuId}/tujuanSasaranIndikator/new`}
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Tujuan/Sasaran/Indikator baru
                                    </Link>
                                </Button>
                                <ImportPage evaluasi={evaluasi} ikuId={params.ikuId} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable data={IKU.tujuanSasaranIndikatorIKU} columns={columns} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default IKUIdPage;