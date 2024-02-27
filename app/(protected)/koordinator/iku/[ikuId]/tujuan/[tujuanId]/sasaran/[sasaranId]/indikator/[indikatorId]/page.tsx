import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";

const IndikatorIdPage = async ({
    params
}: {
    params: { ikuId: string, tujuanId: string, sasaranId: string, indikatorId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const indikatorIKU = await db.indikatorIKU.findUnique({
        where: {
            id: params.indikatorId,
        },
    });

    if (!indikatorIKU) {
        return redirect("/");
    }

    const requiredFields = [
        indikatorIKU.name,
        indikatorIKU.kode,
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
                            href={`/koordinator/iku/${params.ikuId}/tujuan/${params.tujuanId}/sasaran/${params.sasaranId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to indikator IKU list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                Indikator IKU setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                IKUId={params.ikuId}
                                tujuanId={params.tujuanId}
                                sasaranId={params.sasaranId}
                                indikatorId={params.indikatorId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your indikator IKU
                            </h2>
                        </div>
                        <NameForm
                            initialData={indikatorIKU}
                            IKUId={params.ikuId}
                            tujuanId={params.tujuanId}
                            sasaranId={params.sasaranId}
                            indikatorId={params.indikatorId}

                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                Indikator details
                                </h2>
                            </div>
                            <KodeForm
                                initialData={indikatorIKU}
                                IKUId={params.ikuId}
                                tujuanId={params.tujuanId}
                                sasaranId={params.sasaranId}
                                indikatorId={params.indikatorId}

                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IndikatorIdPage;