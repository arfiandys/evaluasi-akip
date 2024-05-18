import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { EvaluasiCard } from "./_components/evaluasi-card";


const EvaluasiPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const evaluasi = await db.evaluasi.findMany({
        orderBy: {
            id: "asc",
        },
        include: {
            variabelsLKE: {
                orderBy: {
                    kode: "asc"
                }
            },
            variabelsKKE: {
                orderBy: {
                    kode: "asc"
                }
            },
            permindoks: true,
            IKUs: true,
        }
    });

    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar evaluasi
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
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex justify-end my-4">
                    <Button asChild>
                        <Link
                            href={`/koordinator/evaluasi/new`}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Evaluasi baru
                        </Link>
                    </Button>
                </div>
            </div>
            {/* <DataTable data={evaluasi} columns={columns} /> */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4 px-4 lg:px-10">
                {evaluasi.map((item) => {
                    const requiredFields = [
                        item.IKUs.length,
                        item.permindoks.length,
                        item.variabelsLKE.length,
                        item.variabelsKKE.length,
                        item.title,
                        item.description,
                        item.tahun,
                    ];
                
                    const totalFields = requiredFields.length;
                    const completedFields = requiredFields.filter(Boolean).length;
                    const progress = (completedFields / totalFields) * 100
                    const completionText = `(${completedFields}/${totalFields})`
                    const isComplete = requiredFields.every(Boolean);
                    return (
                        <EvaluasiCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            imageUrl={"/logo.svg"}
                            LKELength={item.variabelsLKE.length}
                            KKELength={item.variabelsKKE.length}
                            PermindokLength={item.permindoks.length}
                            IKULength={item.IKUs.length}
                            progress={progress}
                            tahun={item.tahun!}
                            description={item.description!}
                            status={item.status}
                        />
                    )
                })}
            </div>
            {evaluasi.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    Tidak ada evaluasi yang ditemukan
                </div>
            )}
        </div>
    );
}

export default EvaluasiPage;