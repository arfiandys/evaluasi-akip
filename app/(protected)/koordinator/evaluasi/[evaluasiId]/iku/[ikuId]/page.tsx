import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { TahunForm } from "./_components/tahun-form";
import { BobotForm } from "./_components/bobot-form";
import CreateSubKomponenPage from "./_components/create-form";
import CreateTujuanSasaranIndikatorIKUPage from "./_components/create-tsi-form";
import { DataTable } from "./tujuanSasaranIndikator/_components/data-table";
import { columns } from "./tujuanSasaranIndikator/_components/columns";
import { Button } from "@/components/ui/button";

const IKUIdPage = async ({
    params
}: {
    params: { evaluasiId: string, ikuId: string }
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
            tujuanSasaranIndikatorIKU: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    IKU: true
                }
            },
        },
    });

    if (!IKU) {
        return redirect("/");
    }

    const requiredFields = [
        IKU.name,
        IKU.tujuanSasaranIndikatorIKU.length
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/iku`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke IKU list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail Indikator Kinerja Utama
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
                <div className="mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit detail IKU
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <NameForm
                            initialData={IKU}
                            IKUId={IKU.id}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Tujuan/Sasaran/Indikator
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-end my-4">
                            <Button asChild>
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/iku/${params.ikuId}/tujuanSasaranIndikator/new`}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Tujuan/Sasaran/Indikator baru
                                </Link>
                            </Button>
                        </div>
                        <DataTable data={IKU.tujuanSasaranIndikatorIKU} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default IKUIdPage;