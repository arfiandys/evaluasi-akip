import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, Edit, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { BobotForm } from "./_components/bobot-form";
import CreateSubKriteriaPage from "./_components/create-form";
import { DataTable } from "./subKriteria/_components/data-table";
import { columns } from "./subKriteria/_components/columns";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";

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

const KriteriaIdPage = async ({
    params
}: {
    params: { evaluasiId: string, komponenId: string, subKomponenId: string, kriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kriteria = await db.kriteriaLKE.findUnique({
        where: {
            id: params.kriteriaId,
        },
        include: {
            subKriteriaLKE: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    variabelLKE: true
                }
            },
            variabelLKE: true
        },
    });

    if (!kriteria) {
        return redirect("/");
    }

    const requiredFields = [
        kriteria.name,
        kriteria.kode,
        kriteria.bobot,
        kriteria.subKriteriaLKE.length,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke daftar kriteria
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian kriteria
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                evaluasiId={params.evaluasiId}
                                disabled={!isComplete}
                                kriteriaId={params.kriteriaId}
                                subKomponenId={params.subKomponenId}
                                komponenId={params.komponenId}
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
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}/kriteria/${params.kriteriaId}/edit`}
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
                                        {kriteria.name}
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
                                        {kriteria.kode}
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
                                        Bobot
                                    </p>
                                    <p className="text-sm text-muted-foreground text-wrap">
                                        {kriteria.bobot}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg col-span-4 xl:col-span-3 rounded-3xl">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center space-y-2 flex-wrap">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={ListTree} />
                                <CardTitle>Sub kriteria</CardTitle>
                            </div>
                            <Button asChild>
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}/kriteria/${params.kriteriaId}/subKriteria/new`}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Sub kriteria baru
                                </Link>
                            </Button>

                        </CardHeader>
                        <CardContent>
                            <DataTable data={kriteria.subKriteriaLKE} columns={columns} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default KriteriaIdPage;