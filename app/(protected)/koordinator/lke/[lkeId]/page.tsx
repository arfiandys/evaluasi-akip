import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, Building, LayoutDashboard, User } from "lucide-react";
import { redirect } from "next/navigation";
import { TahunForm } from "./_components/tahun-form";
import { KriteriaForm } from "./_components/kriteria-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { KodeForm } from "./_components/kode-form";
import { JenisIsianForm } from "./_components/jenisIsian-form";
import { IsSubKriteriaForm } from "./_components/isSubKriteria-form";

const IsianLKEIdPage = async ({
    params
}: {
    params: { lkeId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const isianLKE = await db.isianLKE.findUnique({
        where: {
            id: params.lkeId,
        },        
    });

    const subKriteria = await db.subKriteriaLKE.findMany({
        orderBy: {
            kode: "asc",
        },
    });

    const kriteria = await db.kriteriaLKE.findMany({
        orderBy: {
            kode: "asc",
        },
    });

    const subKomponen = await db.subKomponenLKE.findMany({
        orderBy: {
            kode: "asc",
        },
    });

    const komponen = await db.komponenLKE.findMany({
        orderBy: {
            kode: "asc",
        },
    });

    if (!isianLKE) {
        return redirect("/");
    }

    const requiredFields = [
        isianLKE.kode,
        isianLKE.tahun,
        isianLKE.jenisIsian,
        isianLKE.kriteriaLKEId,
        isianLKE.subKriteriaLKEId
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
                            href={`/koordinator/lke`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to LKE list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    LKE setup
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                lkeId={params.lkeId}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customize your kriteria LKE details
                            </h2>
                        </div>
                        <KodeForm
                            initialData={isianLKE}
                            lkeId={isianLKE.id}
                        />
                        <TahunForm
                            initialData={isianLKE}
                            lkeId={isianLKE.id}
                        />
                        <JenisIsianForm
                            initialData={isianLKE}
                            lkeId={isianLKE.id}
                        />
                        <IsSubKriteriaForm
                            initialData={isianLKE}
                            lkeId={isianLKE.id}
                        />
                        {/* <DalnisForm
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
                        /> */}
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Building} />
                            <h2 className="text-xl">
                                Customize kriteria of LKE
                            </h2>
                        </div>
                        <KriteriaForm
                            initialData={isianLKE}
                            lkeId={isianLKE.id}
                            options={kriteria.map((kriteria) => ({
                                label: kriteria.name,
                                value: kriteria.id,
                            }))}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default IsianLKEIdPage;