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
import SubKomponenNewCreate from "./create-form";
import { db } from "@/lib/db";

const SubKomponenNewPage = async ({
    params
}: {
    params: { komponenId: string, evaluasiId: string }
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
    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2 justify-between">
                        <div className="">
                            <h1 className="text-2xl font-medium">
                                Membuat sub komponen baru
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
                                    <BreadcrumbLink asChild>
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lke/komponen/${params.komponenId}`}>Sub komponen</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Sub komponen baru</BreadcrumbPage>
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
                                    Detail
                                </h2>
                                <span className="text-sm text-secondary-foreground">
                                    Nama, kode, bobot nilai...
                                </span>
                            </div>
                        </div>
                    </div>
                    <SubKomponenNewCreate komponenId={params.komponenId} evaluasi={evaluasi!} />
                </div>
            </div>
        </>
    );
}

export default SubKomponenNewPage;