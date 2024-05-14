import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { TahunForm } from "./_components/tahun-form";
import VariabelLKEPage from "./_components/_variabelLKE/variabelLKE-table";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import VariabelKKEPage from "./_components/_variabelKKE/variabelKKE-table";
import PermindokPage from "./_components/_permindok/permindok-table";
import IKUViewPage from "./_components/_iku/iku-table";
import LKEUnitKerjaPage from "./_components/_LKEUnitKerja/LKEUnitKerja-table";
import KKEUnitKerjaPage from "./_components/_KKEUnitKerja/KKEUnitKerja-table";
import PermindokUnitKerjaPage from "./_components/_permindokUnitKerja/permindokUnitKerja-table";

const EvaluasiIdPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const evaluasi = await db.evaluasi.findUnique({
        where: {
            id: params.evaluasiId,
        },
        include: {
            variabelsLKE: {
                orderBy: {
                    kode: "asc"
                },
            },
            variabelsKKE: {
                orderBy: {
                    kode: "asc"
                }
            }
        },
    });

    if (!evaluasi) {
        return redirect("/");
    }

    const requiredFields = [
        evaluasi.title,
        evaluasi.description,
        evaluasi.tahun,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean);

    // Data
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

    const variabelKKE = await db.variabelKKE.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaKKE: true,
            variabelLKE: true,
            variabelUnitKerja: true,
        }
    });

    const permindok = await db.permindok.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            evaluasi: true
        }
    });

    const IKU = await db.iKU.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            name: "asc",
        },
    });

    // LKE
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

    // KKE
    const KKEUnitKerja = await db.variabelKKEUnitKerja.findMany({
        where: {
            variabelKKE: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                variabelKKE: {
                    kode: "asc"
                }
            }
        ],
        include: {
            variabelKKE: {
                include: {
                    kriteriaKKE: true,
                }
            },
            unitKerja: true,
        }
    })

    // PERMINDOK
    const permindokUnitKerja = await db.permindokUnitKerja.findMany({
        where: {
            permindok: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                permindok: {
                    kode: "asc"
                }
            }
        ],
        include: {
            permindok: true,
            unitKerja: true,
        }
    })

    return (
        <>
            <div className="p-6 flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/koordinator/evaluasi`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6 w-fit"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar evaluasi
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail evaluasi
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                evaluasiId={params.evaluasiId}
                                status={evaluasi.status}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16 flex flex-col">
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="shadow-lg col-span-1">
                            <CardHeader>
                                <CardTitle>Detail evaluasi</CardTitle>
                                <CardDescription>Card Description</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Title
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {evaluasi.title}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Deskripsi
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {evaluasi.description}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                >
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Tahun
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {evaluasi.tahun}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <PermindokPage evaluasiId={params.evaluasiId} permindok={permindok} />
                        <IKUViewPage evaluasiId={params.evaluasiId} iku={IKU} />
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <VariabelKKEPage evaluasiId={params.evaluasiId} variabelKKE={variabelKKE} />
                        <VariabelLKEPage evaluasiId={params.evaluasiId} variabelLKE={variabelLKE} />
                    </div>
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <LKEUnitKerjaPage evaluasiId={params.evaluasiId} LKEUnitKerja={LKEUnitKerja} />
                        <KKEUnitKerjaPage evaluasiId={params.evaluasiId} KKEUnitKerja={KKEUnitKerja} />
                        <PermindokUnitKerjaPage evaluasiId={params.evaluasiId} permindokUnitKerja={permindokUnitKerja} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default EvaluasiIdPage;