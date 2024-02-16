import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, CircleDollarSign, File, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { TahunForm } from "./_components/tahun-form";
import { BobotForm } from "./_components/bobot-form";

const SubKomponenIdPage = async ({
    params
}: {
    params: { subKomponenId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const subKomponen = await db.subKomponenLKE.findUnique({
        where: {
            id: params.subKomponenId,
        },
        include: {
            kriteriaLKE: {
                orderBy: {
                    name: "asc"
                },
                include: {
                    subKriteriaLKE: {
                        orderBy: {
                            name: "asc"
                        }
                    }
                }
            },
        },
    });

    if (!subKomponen) {
        return redirect("/");
    }

    const requiredFields = [
        subKomponen.name,
        subKomponen.kode,
        subKomponen.tahun,
        subKomponen.bobot,
        subKomponen.kriteriaLKE.length,
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
                            href={`/koordinator/komponen-lke`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to sub komponen list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Sub komponen setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                subKomponenId={params.subKomponenId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your team
                            </h2>
                        </div>
                        <NameForm
                            initialData={komponen}
                            komponenLKEId={komponen.id}
                        />
                        <KodeForm
                            initialData={komponen}
                            komponenLKEId={komponen.id}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Team members
                                </h2>
                            </div>
                            <TahunForm
                                initialData={komponen}
                                komponenLKEId={komponen.id}
                            />
                            <BobotForm
                                initialData={komponen}
                                komponenLKEId={komponen.id}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Sub komponen
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <CreatePage komponenId={komponen.id}  />
                        <DataTable data={komponen.subKomponenLKE} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubKomponenIdPage;