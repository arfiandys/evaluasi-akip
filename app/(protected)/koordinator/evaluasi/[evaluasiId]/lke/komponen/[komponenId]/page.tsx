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
import { columns } from "./subKomponen/_components/columns";
import { DataTable } from "./subKomponen/_components/data-table";
import { Button } from "@/components/ui/button";

const KomponenIdPage = async ({
    params
}: {
    params: { evaluasiId: string, komponenId: string }
}) => {

    const userId = await currentId();

    if (!userId) {
        return redirect("/");
    }

    const komponen = await db.komponenLKE.findUnique({
        where: {
            id: params.komponenId,
        },
        include: {
            subKomponenLKE: {
                orderBy: {
                    kode: "asc"
                },
                include: {
                    kriteriaLKE: {
                        orderBy: {
                            kode: "asc"
                        }
                    },
                    variabelLKE: true
                }
            },
        },
    });

    if (!komponen) {
        return redirect("/");
    }

    const requiredFields = [
        komponen.name,
        komponen.kode,
        komponen.tahun,
        komponen.bobot,
        komponen.subKomponenLKE.length,
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
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            kembali ke daftar komponen
                        </Link>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Detail komponen
                                </h1>
                                <span className="text-sm text-secondary-foreground">
                                    Lengkapi semua isian {completionText}
                                </span>
                            </div>
                            <Actions
                                disabled={!isComplete}
                                komponenId={params.komponenId}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl">
                            Edit detail komponen
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <NameForm
                            initialData={komponen}
                            komponenId={komponen.id}
                        />
                        <KodeForm
                            initialData={komponen}
                            komponenId={komponen.id}
                        />
                        <BobotForm
                            initialData={komponen}
                            komponenId={komponen.id}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-16">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListTree} />
                        <h2 className="text-xl">
                            Sub komponen
                        </h2>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="flex justify-end my-4">
                            <Button asChild>
                                <Link
                                    href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}/subKomponen/new`}
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Sub komponen baru
                                </Link>
                            </Button>
                        </div>
                        <DataTable data={komponen.subKomponenLKE} columns={columns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default KomponenIdPage;