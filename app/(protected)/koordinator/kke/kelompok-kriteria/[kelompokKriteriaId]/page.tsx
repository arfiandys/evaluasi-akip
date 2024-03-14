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
import CreateKriteriaPage from "./_components/create-form";
import { columns } from "./kriteria/_components/columns";
import { DataTable } from "./kriteria/_components/data-table";

const KelompokKriteriaIdPage = async ({
    params
}: {
    params: { kelompokKriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kelompokKriteria = await db.kelompokKriteriaKKE.findUnique({
        where: {
            id: params.kelompokKriteriaId,
        },
        include: {
            kriteriaKKE: {
                orderBy: {
                    nama: "asc"
                },
            },
        },
    });

    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            id: "asc"
        },
    });

    if (!kelompokKriteria) {
        return redirect("/");
    }

    const requiredFields = [
        kelompokKriteria.name,
        kelompokKriteria.kode,
        kelompokKriteria.tahun,
        kelompokKriteria.kriteriaKKE.length,
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
                            href={`/koordinator/kke/kelompok-kriteria`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to kelompok kriteria KKE list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail kelompok kriteria KKE
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                kelompokKriteriaId={params.kelompokKriteriaId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Edit detail kelompok kriteria KKE
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <NameForm
                            initialData={kelompokKriteria}
                            kelompokKriteriaId={kelompokKriteria.id}
                        />
                        <KodeForm
                            initialData={kelompokKriteria}
                            kelompokKriteriaId={kelompokKriteria.id}
                        />
                        <TahunForm
                                initialData={kelompokKriteria}
                                kelompokKriteriaId={kelompokKriteria.id}
                            />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Kriteria KKE
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <CreateKriteriaPage
                            kelompokKriteriaId={kelompokKriteria.id}
                            variabel_options={variabelLKE.map((variabel) => ({
                                label: variabel.kode,
                                value: variabel.id,
                                data: variabel
                            }))}
                        />
                        <DataTable data={kelompokKriteria.kriteriaKKE} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default KelompokKriteriaIdPage;