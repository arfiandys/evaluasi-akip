import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";

const KriteriaKKEIdPage = async ({
    params
}: {
    params: { kriteriaId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const kriteriaKKE = await db.kriteriaKKE.findUnique({
        where: {
            id: params.kriteriaId,
        },
    });

    if (!kriteriaKKE) {
        return redirect("/");
    }

    const requiredFields = [
        kriteriaKKE.nama,
        kriteriaKKE.kode,
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
                            href={`/koordinator/kke/kelompok-kriteria/${kriteriaKKE.kelompokKriteriaKKEId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to kriteria KKE list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail kriteria KKE
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                kriteriaId={params.kriteriaId}
                                kelompokKriteriaKKEId={kriteriaKKE?.kelompokKriteriaKKEId!}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                               Edit detail kriteria KKE
                            </h2>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <NameForm
                            initialData={kriteriaKKE}
                            kriteriaId={params.kriteriaId}
                            kelompokKriteriaKKEId={kriteriaKKE?.kelompokKriteriaKKEId!}
                        />
                        <KodeForm
                            initialData={kriteriaKKE}
                            kriteriaId={params.kriteriaId}
                            kelompokKriteriaKKEId={kriteriaKKE?.kelompokKriteriaKKEId!}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default KriteriaKKEIdPage;