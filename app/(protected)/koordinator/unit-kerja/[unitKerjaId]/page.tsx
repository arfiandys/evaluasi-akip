import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { PimpinanForm } from "./_components/pimpinan-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { KodeWilayahForm } from "./_components/kode-wilayah-form";
import { KodeUnitKerjaForm } from "./_components/kode-unit-kerja-form";
import { PICForm } from "./_components/pic-form";
import { UserRole, AccountRole } from "@prisma/client";

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
        unitKerja.users.some(users => users.assignedRole === UserRole.PIMPINAN ),
        unitKerja.users.some(users => users.assignedRole === UserRole.PIC )
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
                            Back to unit kerja list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Unit Kerja setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                unitKerjaId={params.unitKerjaId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your unit kerja details
                            </h2>
                        </div>
                        <NameForm
                            initialData={unitKerja}
                            unitKerjaId={unitKerja.id}
                        />
                        <KodeWilayahForm
                            initialData={unitKerja}
                            unitKerjaId={unitKerja.id}
                        />
                        <KodeUnitKerjaForm
                            initialData={unitKerja}
                            unitKerjaId={unitKerja.id}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={User} />
                            <h2 className="text-xl">
                                Customize members of unit kerja
                            </h2>
                        </div>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default UnitKerjaIdPage;