import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { Activity, ArrowLeft, LayoutDashboard, User, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { PimpinanForm } from "./_components/pimpinan-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { KodeWilayahForm } from "./_components/kode-wilayah-form";
import { KodeUnitKerjaForm } from "./_components/kode-unit-kerja-form";
import { PICForm } from "./_components/pic-form";
import { UserRole, AccountRole } from "@prisma/client";
import { JenisUnitKerjaForm } from "./_components/jenisUnitKerja-form";

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

const UnitKerjaIdPage = async ({
    params
}: {
    params: { unitKerjaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const unitKerja = await db.unitKerja.findUnique({
        where: {
            id: params.unitKerjaId,
        },
        include: {
            users: {
                orderBy: {
                    unitKerjaId: "asc"
                },
            }
        }
    });

    const users = await db.user.findMany({
        where: {
            NOT: {
                role: AccountRole.ADMIN
            },
        },
        orderBy: {
            name: "asc",
        },
    });

    if (!unitKerja) {
        return redirect("/");
    }

    const requiredFields = [
        unitKerja.name,
        unitKerja.kodeWilayah,
        unitKerja.kodeUnitKerja,
        unitKerja.users.some(users => users.assignedRole === UserRole.PIMPINAN),
        unitKerja.users.some(users => users.assignedRole === UserRole.PIC)
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
                            href={`/koordinator/unit-kerja`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar unit kerja
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Rincian unit Kerja
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                unitKerjaId={params.unitKerjaId}
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
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                            />
                            <Separator orientation="horizontal" />
                            <KodeWilayahForm
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                            />
                            <Separator orientation="horizontal" />
                            <KodeUnitKerjaForm
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                            />
                            <Separator orientation="horizontal" />
                            <JenisUnitKerjaForm
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                            />
                        </CardContent>
                    </Card>
                    <Card className="h-fit shadow-lg col-span-4 sm:col-span-3 xl:col-span-3 2xl:col-span-3 rounded-3xl">
                        <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                            <div className="flex flex-row gap-x-4 justify-start items-center">
                                <IconBadge icon={Users} />
                                <CardTitle>Rincian anggota tim evaluasi</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <PimpinanForm
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                                options={users.map((user) => ({
                                    label: user.name!,
                                    value: user.id,
                                }))}
                            />
                            <PICForm
                                initialData={unitKerja}
                                unitKerjaId={unitKerja.id}
                                options={users.map((user) => ({
                                    label: user.name!,
                                    value: user.id,
                                }))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default UnitKerjaIdPage;