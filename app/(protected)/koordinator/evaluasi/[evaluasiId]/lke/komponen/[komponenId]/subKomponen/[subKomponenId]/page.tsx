import { IconBadge } from "@/components/icon-badge";
import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks, ListTree, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { NameForm } from "./_components/name-form";
import { KodeForm } from "./_components/kode-form";
import { Actions } from "./_components/actions";
import Link from "next/link";
import { BobotForm } from "./_components/bobot-form";
import CreateKriteriaPage from "./_components/create-form";
import { DataTable } from "./kriteria/_components/data-table";
import { columns } from "./kriteria/_components/columns";
import { Button } from "@/components/ui/button";

const SubKomponenIdPage = async ({
    params
}: {
    params: { evaluasiId: string ,komponenId: string, subKomponenId: string }
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
                    kode: "asc"
                },
                include: {
                    subKriteriaLKE: {
                        orderBy: {
                            kode: "asc"
                        }
                    },
                    variabelLKE: true
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke daftar sub komponen
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail sub komponen
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                subKomponenId={params.subKomponenId}
                                komponenId={subKomponen?.komponenLKEId!}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit detail sub komponen
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                        <NameForm
                            initialData={subKomponen}
                            subKomponenId={subKomponen.id}
                            komponenId={subKomponen?.komponenLKEId!}
                        />
                        <KodeForm
                            initialData={subKomponen}
                            subKomponenId={subKomponen.id}
                            komponenId={subKomponen?.komponenLKEId!}
                        />
                        <BobotForm
                            initialData={subKomponen}
                            subKomponenId={subKomponen.id}
                            komponenId={subKomponen?.komponenLKEId!}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Kriteria
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-end my-4">
                            <Button asChild>
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/${params.subKomponenId}/kriteria/new`}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Kriteria baru
                                </Link>
                            </Button>
                        </div>
                        <DataTable data={subKomponen.kriteriaLKE} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubKomponenIdPage;