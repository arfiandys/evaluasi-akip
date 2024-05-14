import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { BobotForm } from "./_components/bobot-form";
import CreateSubKriteriaPage from "./_components/create-form";
import { DataTable } from "./subKriteria/_components/data-table";
import { columns } from "./subKriteria/_components/columns";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Button } from "@/components/ui/button";

const KriteriaIdPage = async ({
    params
}: {
    params: { evaluasiId: string, komponenId: string, subKomponenId: string, kriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kriteria = await db.kriteriaLKE.findUnique({
        where: {
            id: params.kriteriaId,
        },
        include: {
            subKriteriaLKE: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    variabelLKE: true
                }
            },
            variabelLKE: true
        },
    });

    if (!kriteria) {
        return redirect("/");
    }

    const requiredFields = [
        kriteria.name,
        kriteria.kode,
        kriteria.bobot,
        kriteria.subKriteriaLKE.length,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke daftar kriteria
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail kriteria
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                kriteriaId={params.kriteriaId}
                                subKomponenId={params.subKomponenId}
                                komponenId={params.komponenId}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit detail kriteria
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NameForm
                            initialData={kriteria}
                            kriteriaId={params.kriteriaId}
                            subKomponenId={params.subKomponenId}
                            komponenId={params.komponenId}
                        />
                        <KodeForm
                            initialData={kriteria}
                            kriteriaId={params.kriteriaId}
                            subKomponenId={params.subKomponenId}
                            komponenId={params.komponenId}
                        />
                        <BobotForm
                            initialData={kriteria}
                            kriteriaId={params.kriteriaId}
                            subKomponenId={params.subKomponenId}
                            komponenId={params.komponenId}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Sub kriteria
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        {(kriteria.variabelLKE?.jenisIsian === "number") ? (
                            <div className="flex justify-end my-4">
                                <Button asChild>
                                    <Link
                                        href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}/kriteria/${params.kriteriaId}/subKriteria/new`}
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Sub kriteria baru
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <></>
                        )}
                        <DataTable data={kriteria.subKriteriaLKE} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default KriteriaIdPage;