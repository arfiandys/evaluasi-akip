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
import TSIEdit from "./edit-form";
import { db } from "@/lib/db";

const TSINewPage = async ({
    params
}: {
    params: { evaluasiId: string, ikuId: string, tujuanSasaranIndikatorId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.findUnique({
        where: {
            id: params.tujuanSasaranIndikatorId,
        },
    });

    if (!tujuanSasaranIndikatorIKU) {
        return redirect("/");
    }

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Edit Tujuan/Sasaran/Indikator
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
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/iku`}>IKU</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/iku/${params.ikuId}`}>Tujuan/Sasaran/Indikator</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Edit Tujuan/Sasaran/Indikator</BreadcrumbPage>
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
                    <TSIEdit
                        ikuId={params.ikuId} evaluasiId={params.evaluasiId} tujuanSasaranIndikator={tujuanSasaranIndikatorIKU}
                    />
                </div>
            </div>
        </>
    );
}

export default TSINewPage;