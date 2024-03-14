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
import { SubKriteriaForm } from "./_components/subKriteria-form";
import { KriteriaOrSubForm } from "./_components/kriteriaOrSub-form";
import { CatatanForm } from "./_components/catatan-form";

const IsianLKEIdPage = async ({
    params
}: {
    params: { variabelId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const variabelLKE = await db.variabelLKE.findUnique({
        where: {
            id: params.variabelId,
        },
    });

    const subKriteria = await db.subKriteriaLKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaLKE: {
                include: {
                    subKomponenLKE: {
                        include: {
                            komponenLKE: true
                        }
                    }
                }
            }
        }
    });

    const kriteria = await db.kriteriaLKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            subKomponenLKE: {
                include: {
                    komponenLKE: true
                }
            }
        }
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

    if (!variabelLKE) {
        return redirect("/");
    }

    const requiredFields = [
        variabelLKE.kode,
        variabelLKE.tahun,
        variabelLKE.jenisIsian,
        variabelLKE.kriteriaLKEId || variabelLKE.subKriteriaLKEId
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
                            href={`/koordinator/lke/variabel`}
                            className="flex w-fit items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Variabel list
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail variabel LKE
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                variabelId={params.variabelId}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit detail variabel
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <KodeForm
                            initialData={variabelLKE}
                            variabelId={variabelLKE.id}
                        />
                        <TahunForm
                            initialData={variabelLKE}
                            variabelId={variabelLKE.id}
                        />
                        <JenisIsianForm
                            initialData={variabelLKE}
                            variabelId={variabelLKE.id}
                        />
                        <IsSubKriteriaForm
                            initialData={variabelLKE}
                            variabelId={variabelLKE.id}
                        />
                        <KriteriaOrSubForm
                            variabelLKE={variabelLKE}
                            variabelId={variabelLKE.id}
                            kriteria={kriteria}
                            subKriteria={subKriteria}
                        />
                        <CatatanForm
                            initialData={variabelLKE}
                            variabelId={variabelLKE.id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default IsianLKEIdPage;