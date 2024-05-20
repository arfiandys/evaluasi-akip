import { db } from "@/lib/db";
import { PDF } from "./_component/lhe-pdf";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "./_component/data-table";
import { columns } from "./_component/columns";

const LHEPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {

    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const LHE = await db.lHE.findMany({
        where: {
            evaluasiId: params.evaluasiId
        },
        orderBy: {
            nameDokumen: "asc",
        },
        include: {
            evaluasi: true,
            unitKerja: true
        }
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar LHE
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
                                    <Link href={`/koordinator/evaluasi/${params.evaluasiId}/lhe`}>LHE</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex justify-end my-4">
                    <Button asChild>
                        <Link
                            href={`/koordinator/evaluasi/${params.evaluasiId}/lhe/new`}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            LHE baru
                        </Link>
                    </Button>
                </div>
            </div>
            <DataTable data={LHE} columns={columns} />
        </div>
    );
}

export default LHEPage;