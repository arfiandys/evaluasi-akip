import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, Edit, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import Link from "next/link";

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

const KriteriaKKEIdPage = async ({
    params
}: {
    params: { kriteriaId: string, evaluasiId: string, kelompokKriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kriteriaKKE = await db.kriteriaKKE.findUnique({
        where: {
            id: params.kriteriaId,
        },
    });

    if (!kriteriaKKE) {
        return redirect("/");
    }

    const requiredFields = [
        kriteriaKKE.nama,
        kriteriaKKE.kode,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria/${params.kelompokKriteriaId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar kriteria KKE
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian kriteria KKE
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                evaluasiId={params.evaluasiId}
                                disabled={!isComplete}
                                kriteriaId={params.kriteriaId}
                                kelompokKriteriaKKEId={kriteriaKKE?.kelompokKriteriaKKEId!}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mt-20 grid gap-6 grid-cols-4">
                    <Card className="shadow-lg col-span-4 md:col-start-2 md:col-span-2 rounded-3xl h-fit">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Activity} />
                                <CardTitle>Rincian dasar</CardTitle>
                            </div>
                            <Button asChild variant="ghost">
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/kke/kelompok-kriteria/${params.kelompokKriteriaId}/kriteria/${params.kriteriaId}/edit`}
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
                                        {kriteriaKKE.nama}
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
                                        {kriteriaKKE.kode}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default KriteriaKKEIdPage;