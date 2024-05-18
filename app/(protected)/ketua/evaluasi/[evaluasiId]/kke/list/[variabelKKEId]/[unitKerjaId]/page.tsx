import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, CircleIcon, File, StarIcon } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";


const IKUAnggotaPage = async ({
    params
}: {
    params: { evaluasiId: string, variabelKKEId: string, unitKerjaId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const User = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            unitKerjas: true
        }
    })

    const VariabelIKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
            AND: [
                { unitKerjaId: params.unitKerjaId },
                {
                    tujuanSasaranIndikatorIKUVariabelKKE: {
                        variabelKKEId: params.variabelKKEId
                    }
                },
                {
                    tujuanSasaranIndikatorIKUVariabelKKE: {
                        variabelKKE: {
                            evaluasiId: params.evaluasiId
                        }
                    }
                }
            ]

        },
        orderBy: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                tujuanSasaranIndikatorIKU: {
                    kode: "asc"
                }
            }
        },
        include: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                include: {
                    tujuanSasaranIndikatorIKU: true,
                    variabelKKE: true
                }
            },
            unitKerja: true,
        }
    })

    const variabelKKE = await db.variabelKKE.findUnique({
        where: {
            id: params.variabelKKEId
        },
        include: {
            kriteriaKKE: {
                include: {
                    kelompokKriteriaKKE: true
                }
            }
        }
    })

    const dokumenUnitKerja = await db.permindokUnitKerja.findUnique({
        where: {
            permindokUnitKerjaId: {
                permindokId: variabelKKE?.kriteriaKKE?.kelompokKriteriaKKE.permindokId!,
                unitKerjaId: params.unitKerjaId
            }
        }
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <div className="flex flex-row justify-between items-start">
                <Link
                    href={`/ketua/evaluasi/${params.evaluasiId}/kke/list`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6 w-fit"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    kembali ke daftar KKE
                </Link>
                <Card>
                    <CardHeader className="grid grid-cols-[1fr_170px] items-start gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle>{variabelKKE?.kode}</CardTitle>
                            <CardDescription>
                                {variabelKKE?.kriteriaKKE?.nama}
                            </CardDescription>
                        </div>
                        <div className="flex items-center justify-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                            {(dokumenUnitKerja?.url) ? (
                                <Link href={dokumenUnitKerja?.url} legacyBehavior>
                                    <a target="_blank">
                                        <Button variant="secondary" className="px-3 shadow-none">
                                            <File className="mr-2 h-4 w-4" />
                                            Lihat dokumen
                                        </Button>
                                    </a>
                                </Link>
                            ) : (
                                <Button variant="secondary" className="px-3 shadow-none">
                                    <File className="mr-2 h-4 w-4" />
                                    Dokumen kosong
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                </Card>
            </div>

            <DataTable data={VariabelIKUUnitKerja} columns={columns} />
        </div>
    );
}

export default IKUAnggotaPage;