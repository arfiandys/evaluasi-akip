import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, Building, LayoutDashboard, User, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KetuaForm } from "./_components/ketua-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { AnggotaForm } from "./_components/anggota-form";
import { UserRole, AccountRole } from "@prisma/client";
import { DalnisForm } from "./_components/dalnis-form";

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

const TimEvaluasiIdPage = async ({
    params
}: {
    params: { timEvaluasiId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const timEvaluasi = await db.timEvaluasi.findUnique({
        where: {
            id: params.timEvaluasiId,
        },
        include: {
            users: {
                orderBy: {
                    userId: "asc"
                },
                include: {
                    user: {
                        include: {
                            unitKerjas: {
                                orderBy: {
                                    unitKerjaId: "asc"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const users = await db.user.findMany({
        where: {
            NOT: {
                role: AccountRole.ADMIN,
            },
        },
        orderBy: {
            name: "asc",
        },
        include: {
            unitKerjas: {
                orderBy: {
                    unitKerjaId: "asc"
                }
            }
        }
    });

    const unitKerjas = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!timEvaluasi) {
        return redirect("/");
    }

    const requiredFields = [
        timEvaluasi.name,
        timEvaluasi.users.some(users => users.assignedRole === UserRole.DALNIS),
        timEvaluasi.users.some(users => users.assignedRole === UserRole.KETUA),
        timEvaluasi.users.some(users => users.assignedRole === UserRole.ANGGOTA),
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
                            href={`/koordinator/tim-evaluasi`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar tim evaluasi
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian tim evaluasi
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                timEvaluasiId={params.timEvaluasiId}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mt-20 grid gap-6 grid-cols-4">
                    <Card className="shadow-lg col-span-4 sm:col-span-1 xl:col-span-1 2xl:col-span-1 rounded-3xl h-fit">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Activity} />
                                <CardTitle>Rincian dasar</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <NameForm
                                initialData={timEvaluasi}
                                timEvaluasiId={timEvaluasi.id}
                            />
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg col-span-4 sm:col-span-3 xl:col-span-3 2xl:col-span-3 rounded-3xl h-fit">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Users} />
                                <CardTitle>Rincian anggota tim evaluasi</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <DalnisForm
                                initialData={timEvaluasi}
                                timEvaluasiId={timEvaluasi.id}
                                options={users.map((user) => ({
                                    label: user.name!,
                                    value: user.id,
                                }))}
                            />
                            <KetuaForm
                                initialData={timEvaluasi}
                                timEvaluasiId={timEvaluasi.id}
                                options={users.map((user) => ({
                                    label: user.name!,
                                    value: user.id,
                                }))}
                            />
                            <AnggotaForm
                                initialData={timEvaluasi}
                                initialData_User={users}
                                timEvaluasiId={timEvaluasi.id}
                                options={users.map((user) => ({
                                    label: user.name!,
                                    value: user.id,
                                }))}
                                options_unitKerja={unitKerjas.map((unitKerja) => ({
                                    label: unitKerja.name!,
                                    value: unitKerja.id,
                                }))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default TimEvaluasiIdPage;