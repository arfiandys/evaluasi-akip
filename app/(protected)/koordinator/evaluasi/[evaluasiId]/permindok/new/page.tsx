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
import { db } from "@/lib/db";
import PermindokNewCreate from "./create-form";

const PermindokNewPage = async ({
    params
}: {
    params: { evaluasiId: string }
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
                                Membuat permindok baru
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
                                        <Link href={`/koordinator/evaluasi/${params.evaluasiId}/permindok`}>Permindok</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Permindok baru</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </div>
                <div className="mt-16 grid gap-6 grid-cols-4">
                    <PermindokNewCreate evaluasi={evaluasi!} />
                </div>
            </div>
        </>
    );
}

export default PermindokNewPage;