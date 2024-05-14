import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_components/generate-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";


const GeneratePermindokPage = async ({ params }: { params: { evaluasiId: string } }) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const permindokUnitKerja = await db.permindokUnitKerja.findMany({
        where: {
            permindok: {
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: {
            unitKerjaId: "asc"
        },
        include: {
            permindok: true,
            unitKerja: true,
        }
    })

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar Permindok Unit Kerja
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
                                    <Link href={`/koordinator/evaluasi/${params.evaluasiId}/permindok/generate-permindok`}>Permindok Unit Kerja</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
            <DataTable data={permindokUnitKerja} columns={columns} />
        </div>
    );
}

export default GeneratePermindokPage;