import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { TahunForm } from "./_components/tahun-form";
import { BobotForm } from "./_components/bobot-form";
import CreateSubKomponenPage from "./_components/create-form";
import { DataTable } from "./tujuan/_components/data-table";
import { columns } from "./tujuan/_components/columns";
import CreateTujuanIKUPage from "./_components/create-form";

const IKUIdPage = async ({
    params
}: {
    params: { ikuId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const IKU = await db.iKU.findUnique({
        where: {
            id: params.ikuId,
        },
        include: {
            tujuanIKU: {
                orderBy: {
                    name: "asc"
                },
                include: {
                    sasaranIKU: {
                        orderBy: {
                            name: "asc"
                        }
                    }
                }
            },
        },
    });

    // const IKU = await db.iKU.findUnique({
    //     where: {
    //         id: params.ikuId,
    //     },
    //     include: {
    //         tujuanSasaranIndikatorIKU: {
    //             orderBy: {
    //                 nama: "asc"
    //             },                
    //         },
    //     },
    // });

    if (!IKU) {
        return redirect("/");
    }

    const requiredFields = [
        IKU.name,
        IKU.tahun,
        IKU.tujuanIKU.length,
        // IKU.tujuanSasaranIndikatorIKU.length
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
                            href={`/koordinator/iku`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to IKU list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    IKU setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                IKUId={params.ikuId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your IKU
                            </h2>
                        </div>
                        <NameForm
                            initialData={IKU}
                            IKUId={IKU.id}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    IKU details
                                </h2>
                            </div>
                            <TahunForm
                                initialData={IKU}
                                IKUId={IKU.id}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Tujuan IKU
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <CreateTujuanIKUPage IKUId={IKU.id}  />
                        <DataTable data={IKU.tujuanIKU} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default IKUIdPage;