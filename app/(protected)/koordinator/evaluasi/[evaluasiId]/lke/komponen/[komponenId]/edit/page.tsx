import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import KomponenEdit from "./edit-form";
import { db } from "@/lib/db";

const KomponenEditPage = async ({
    params
}: {
    params: { evaluasiId: string, komponenId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const evaluasi = await db.evaluasi.findUnique({
        where: {
            id: params.evaluasiId
        },
    })

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

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Edit komponen
                            </h1>
                        </div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi`}>Evaluasi</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/variabel`}>Variabel LKE</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen`}>Komponen</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit komponen</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-16">
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-y-2">
                                <h2 className="text-xl font-medium">
                                    Rincian dasar
                                </h2>
                                <span className="text-sm text-secondary-foreground">
                                    Nama, kode, tahun...
                                </span>
                            </div>
                        </div>
                    </div>
                    <KomponenEdit evaluasi={evaluasi!} komponenLKE={komponen}/>
                </div>
            </div>
        </>
    );
}

export default KomponenEditPage;