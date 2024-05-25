import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, Edit, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { columns } from "./kriteria/_components/columns";
import { DataTable } from "./kriteria/_components/data-table";
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

const KelompokKriteriaIdPage = async ({
    params
}: {
    params: { evaluasiId: string, kelompokKriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
        where: {
            id: params.kelompokKriteriaId,
        },
        include: {
            kriteriaKKE: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    variabelKKE: true
                }
            },
        },
    });

    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            id: "asc"
        },
    });

    if (!kelompokKriteria) {
        return redirect("/");
    }

    const requiredFields = [
        kelompokKriteria.name,
        kelompokKriteria.kode,
        kelompokKriteria.tahun,
        kelompokKriteria.kriteriaKKE.length,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke daftar kelompok kriteria KKE
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian kelompok kriteria KKE
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                evaluasiId={params.evaluasiId}
                                disabled={!isComplete}
                                kelompokKriteriaId={params.kelompokKriteriaId}
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
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria/${params.kelompokKriteriaId}/edit`}
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
                                        {kelompokKriteria.name}
                                    </p>
                                </div>
                            </div>
                            <Separator orientation="horizontal" />
                            <div
                                className="my-3 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0"
                            >
                                <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Kode
                                    </p>
                                    <p className="text-sm text-muted-foreground text-wrap">
                                        {kelompokKriteria.kode}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg col-span-4 xl:col-span-3 rounded-3xl">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={ListTree} />
                                <CardTitle>Kriteria</CardTitle>
                            </div>
                            <Button asChild>
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria/${params.kelompokKriteriaId}/kriteria/new`}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Kriteria baru
                                </Link>
                            </Button>

                        </CardHeader>
                        <CardContent>
                            <DataTable data={kelompokKriteria.kriteriaKKE} columns={columns} />
                        </CardContent>
                    </Card>
                </div>
            </div >
        </>
    );
}

export default KelompokKriteriaIdPage;