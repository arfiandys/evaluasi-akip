import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { JenisForm } from "./_components/jenis-form";

const TujuanSasatanIndikatorIdPage = async ({
    params
}: {
    params: { evaluasiId: string, ikuId: string, tujuanSasaranIndikatorId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.findUnique({
        where: {
            id: params.tujuanSasaranIndikatorId,
        },
    });

    if (!tujuanSasaranIndikatorIKU) {
        return redirect("/");
    }

    const requiredFields = [
        tujuanSasaranIndikatorIKU.nama,
        tujuanSasaranIndikatorIKU.kode,
        tujuanSasaranIndikatorIKU.jenis,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/iku/${params.ikuId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Tujuan/Sasaran/Indikator IKU list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail Tujuan/Sasaran/Indikator IKU
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                IKUId={params.ikuId}
                                tujuanId={params.tujuanSasaranIndikatorId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit Tujuan/Sasaran/Indikator IKU
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <NameForm
                            initialData={tujuanSasaranIndikatorIKU}
                            IKUId={params.ikuId}
                            tujuanId={params.tujuanSasaranIndikatorId}
                        />
                        <JenisForm
                            initialData={tujuanSasaranIndikatorIKU}
                            IKUId={params.ikuId}
                            tujuanId={params.tujuanSasaranIndikatorId}
                        />
                        <KodeForm
                            initialData={tujuanSasaranIndikatorIKU}
                            IKUId={params.ikuId}
                            tujuanId={params.tujuanSasaranIndikatorId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default TujuanSasatanIndikatorIdPage;