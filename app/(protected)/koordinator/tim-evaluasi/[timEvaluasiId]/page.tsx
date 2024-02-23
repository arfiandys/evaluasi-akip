import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Building, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KetuaForm } from "./_components/ketua-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { AnggotaForm } from "./_components/anggota-form";
import { UserRole } from "@prisma/client";
import { DalnisForm } from "./_components/dalnis-form";

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
                            unitKerjas : {
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
                role: UserRole.ADMIN,
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
                            Back to tim evaluasi list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Tim evaluasi setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                timEvaluasiId={params.timEvaluasiId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your tim evaluasi details
                            </h2>
                        </div>
                        <NameForm
                            initialData={timEvaluasi}
                            timEvaluasiId={timEvaluasi.id}
                        />
                        <div className="flex mt-6 items-center gap-x-2">
                            <IconBadge icon={User} />
                            <h2 className="text-xl">
                                Customize dalnis and ketua of tim evaluasi
                            </h2>
                        </div>
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
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Building} />
                            <h2 className="text-xl">
                                Customize members and unit kerja of tim evaluasi
                            </h2>
                        </div>                        
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default TimEvaluasiIdPage;